// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod command;

use command::*;
use tauri::{Manager, api::process::Command, async_runtime};

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      #[cfg(debug_assertions)]
      {
        let window = app.get_window("main").unwrap();
        window.open_devtools();
      }
      {
        async_runtime::spawn(async move {
          Command::new_sidecar("ytdl")
            .expect("failed to create `ytdl` binary command")
            .spawn()
            .expect("Failed to spawn sidecar");
        });
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![crypt])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
