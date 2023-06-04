use std::{collections::HashMap, ops::{DerefMut, Deref}};

pub struct StreamingManager {
  streams: HashMap<String, Vec<u8>>
}

impl StreamingManager {
  pub fn new() -> Self {
    StreamingManager { streams: HashMap::new() } 
  }

  pub fn is_stream(&self, stream_key: &str) -> bool {
    self.streams.contains_key(stream_key)
  }

  pub fn drop_stream(&mut self, stream_key: &str) {
    drop(self.streams.get(stream_key));
    self.streams.remove(stream_key);
  }

  pub fn add_stream(&mut self, stream_key: &str, stream: Vec<u8>) {
    self.streams.insert(stream_key.to_string(), stream);
  }

  pub fn get_stream(&self, stream_key: &str) -> Vec<u8> {
    self.streams.get(stream_key).unwrap().to_vec()
  }
}

impl Deref for StreamingManager {
  type Target = HashMap<String, Vec<u8>>;

  fn deref(&self) -> &Self::Target {
      &self.streams
  }
}

impl DerefMut for StreamingManager {
  fn deref_mut(&mut self) -> &mut Self::Target {
      &mut self.streams
  }
}
