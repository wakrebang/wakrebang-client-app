import { createFFmpeg } from '@ffmpeg/ffmpeg';

export const mergeVideoWithAudio = async (
  video: Uint8Array,
  audio: Uint8Array
) => {
  const ffmpeg = window.ffmpeg;
  if (!ffmpeg) {
    throw new Error('ffmpeg is not loaded');
  }

  ffmpeg.FS('writeFile', 'video.mp4', video);
  ffmpeg.FS('writeFile', 'audio.mp4', audio);

  await ffmpeg.run(
    '-i',
    'video.mp4',
    '-i',
    'audio.mp4',
    '-c',
    'copy',
    'output.mp4'
  );

  return new Blob([ffmpeg.FS('readFile', 'output.mp4')], {
    type: 'video/mp4'
  });
};

export const setupFFmpeg = async () => {
  const ffmpeg = createFFmpeg({
    log: true,
    mainName: 'main',
    corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js'
  });
  await ffmpeg.load();

  window.ffmpeg = ffmpeg;
};
