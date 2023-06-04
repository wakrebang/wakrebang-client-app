// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod command;

use command::*;
use tauri::{Manager, api::process::Command, async_runtime, WindowBuilder, WindowUrl, utils::config::{AppUrl, CliArg}};

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
    .invoke_handler(tauri::generate_handler![decrypt_file, encrypt_file])
    .run(context)
    .expect("error while running tauri application");
}
