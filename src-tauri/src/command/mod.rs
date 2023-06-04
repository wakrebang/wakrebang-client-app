use std::{path::Path, fs};

use crypto::{aes};
use sha256::digest;
use tauri::api::file;

#[tauri::command]
pub async fn encrypt_file(path: String, destination: String, keys: Vec<String>, client_id: &str) -> Result<(), String> {
  let buffer = file::read_binary(Path::new(&path)).unwrap();

  let encrypted = crypt(buffer, keys, client_id).unwrap();

  fs::remove_file(path);
  fs::write(destination, encrypted).unwrap();

  Ok(())
}

#[tauri::command]
pub async fn decrypt_file(path: String, keys: Vec<String>, client_id: &str) -> Result<Vec<u8>, String> {
  let buffer = file::read_binary(Path::new(&path)).unwrap();

  let decrypted = crypt(buffer, keys, client_id).unwrap();

  Ok(decrypted)
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