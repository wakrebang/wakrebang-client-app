import { FFmpeg } from '@ffmpeg/ffmpeg';

export {};

declare global {
  interface Window {
    ffmpeg: FFmpeg;
  }
}
