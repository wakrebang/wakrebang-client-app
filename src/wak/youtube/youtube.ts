import ytdl from '@distube/ytdl-core';

// ! TODO 유튜브 동영상 퀄리티 등 Config 로직 추가

export const downloadFromYoutube = (videoUrl: string) =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];
    const stream = ytdl(videoUrl);
    stream.on('data', (c) => chunks.push(c));
    stream.on('finish', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
