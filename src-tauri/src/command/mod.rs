use std::{fs::{self}};

use crypto::{aes};
use sha256::digest;
use tauri::{api::file};

use crate::STREAMING_MANAGER;

const VIDEO_HEADER_SIZE: usize = 64;

#[tauri::command]
pub async fn encrypt_file(path: String, destination: String, keys: Vec<String>, client_id: String) -> Result<bool, ()> {
  let buffer = file::read_binary(&path).unwrap();
  // Encrypt video header
  let encrypted = crypt(buffer[0..VIDEO_HEADER_SIZE].to_vec(), keys, &client_id).unwrap();
  fs::remove_file(path).err();
  fs::write(destination, [encrypted, buffer[VIDEO_HEADER_SIZE..].to_vec()].concat()).unwrap();
  Ok(true)
}

#[tauri::command]
pub async fn decrypt_stream(
  stream_key: String, 
  path: String, 
  keys: Vec<String>, 
  client_id: String,
  enable: bool
) -> Result<bool, ()> {
  if !STREAMING_MANAGER.lock().unwrap().is_stream(&stream_key) {
    let buffer = file::read_binary(&path).unwrap();
    let decrypted = if enable {
      crypt(buffer[0..VIDEO_HEADER_SIZE].to_vec(), keys, &client_id).unwrap()
    } else {
      buffer[0..VIDEO_HEADER_SIZE].to_vec()
    };
    STREAMING_MANAGER.lock().unwrap().add_stream(&stream_key, [decrypted, buffer[VIDEO_HEADER_SIZE..].to_vec()].concat());
  } 
  Ok(true)
}

#[tauri::command]
pub fn drop_stream(
  stream_key: String
) -> Result<bool, ()> {
  STREAMING_MANAGER.lock().unwrap().drop_stream(&stream_key);
  Ok(true)
}

#[tauri::command]
pub fn get_current_video_streams() -> Vec<String> {
  STREAMING_MANAGER.lock().unwrap().keys().cloned().collect()
}

pub fn crypt(buffer: Vec<u8>, keys: Vec<String>, client_id: &str) -> Result<Vec<u8>, ()> {
  let mut data = buffer;
  let iv = generate_key(client_id);
  for key in keys.iter() {
    data = crypt_buffer(&data, key, &iv).unwrap();
  }
  Ok(data)
}

fn crypt_buffer(data: &Vec<u8>, key: &str, iv: &[u8]) -> Result<Vec<u8>, ()> { 
  let mut encryptor = aes::ctr(aes::KeySize::KeySize256, &generate_key(key), iv);
  let mut output: Vec<u8> = vec![0; data.len()];
  encryptor.process(data, &mut output[..]);
  Ok(output)
} 

fn generate_key(secret: &str) -> [u8; 32] {
  let hashed = digest(secret);
  hashed.as_bytes()[0..32].try_into().expect("slice with incorrect length")
}