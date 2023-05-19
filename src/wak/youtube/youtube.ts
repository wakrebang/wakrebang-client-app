import ytdl from 'ytdl-core';
import { createWriteStream } from 'fs';
import { resolve as getAbsolutePath } from 'path';

// ! TODO 유튜브 동영상 퀄리티 등 Config 로직 추가

export const downloadFromYoutube = (videoUrl: string, saveFilePath: string): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const stream = ytdl(videoUrl).pipe(createWriteStream(saveFilePath));
    stream.on('finish', () => resolve(getAbsolutePath(saveFilePath)));
    stream.on('error', reject);
  });
