// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod command;
mod streaming;

use std::{ vec, sync::Mutex };

use command::*;
use tauri::{
  Manager, 
  api::{process::Command}, 
  async_runtime, 
  WindowUrl, 
  utils::config::{AppUrl},
  http::{HttpRange, ResponseBuilder, header::{CONTENT_TYPE, CONTENT_RANGE, CONTENT_LENGTH}, status::StatusCode},
};


use streaming::{StreamingManager};

lazy_static::lazy_static! {
  pub static ref STREAMING_MANAGER: Mutex<StreamingManager> = Mutex::new(StreamingManager::new());
}

fn main() {

  let port = portpicker::pick_unused_port().expect("Failed to find an unused port");

  let mut context = tauri::generate_context!();
  let url = format!("http://localhost:{}", port).parse().unwrap();
  let window_url = WindowUrl::External(url);
  context.config_mut().build.dist_dir = AppUrl::Url(window_url.clone());

  tauri::Builder::default()
    .plugin(tauri_plugin_localhost::Builder::new(port).build())
    .setup(|app| {
        let window = app.get_window("main").unwrap();
        #[cfg(debug_assertions)]
        window.open_devtools();

        async_runtime::spawn(async move {
          Command::new_sidecar("ytdl")
            .expect("failed to create `ytdl` binary command")
            .spawn()
            .expect("Failed to spawn sidecar");
        });
      Ok(())
    })
    .register_uri_scheme_protocol("video-stream", move |_app, request| {
        let path = request.uri().strip_prefix("video-stream://localhost/").unwrap();
        let stream_key = percent_encoding::percent_decode(path.as_bytes())
          .decode_utf8_lossy()
          .to_string();

        let not_found = || {
          ResponseBuilder::new()
            .status(StatusCode::NOT_FOUND)
            .body(vec![])
        };


        if !STREAMING_MANAGER.lock().unwrap().is_stream(&stream_key) {
          return not_found();
        }
        let stream = STREAMING_MANAGER.lock().unwrap().get_stream(&stream_key);

        let len = stream.len() as u64;
  
        let mut resp = ResponseBuilder::new().header(CONTENT_TYPE, "video/mp4");
  
        let response = if let Some(range_header) = request.headers().get("range") {

          let not_satisfiable = || {
            ResponseBuilder::new()
              .status(StatusCode::RANGE_NOT_SATISFIABLE)
              .header(CONTENT_RANGE, format!("bytes */{len}"))
              .body(vec![])
          };
  
          let ranges = if let Ok(ranges) = HttpRange::parse(range_header.to_str()?, len) {
            ranges
              .iter()
              .map(|r| (r.start, r.start + r.length - 1))
              .collect::<Vec<_>>()
          } else {
            return not_satisfiable();
          };
  
          // const MAX_LEN: u64 = 1000 * 1024;          
          let &(start, mut end) = ranges.first().unwrap();

          end = end.min(len - 1);
          let bytes_to_read = end - start + 1;

          // let mut buf = Vec::with_capacity(bytes_to_read as usize);
          resp = resp.header(CONTENT_RANGE, format!("bytes {start}-{end}/{len}"));
          resp = resp.header(CONTENT_LENGTH, bytes_to_read);
          resp = resp.status(StatusCode::PARTIAL_CONTENT);
          resp.body(stream[start as usize..=end as usize].to_vec())
        } else {
          not_found()
        };
  
        response
    })
    .invoke_handler(tauri::generate_handler![encrypt_file, decrypt_stream, drop_stream, get_current_video_streams])
    .run(context)
    .expect("error while running tauri application");
}

