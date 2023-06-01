use crypto::{aes};
use sha256::digest;

#[tauri::command]
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