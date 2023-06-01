import { Command } from '@tauri-apps/api/shell';

const VIDEO_CMD_KEY = {
  Download: '../bin/ytdl'
};

export const downloadVideo = async (url: string) => {
  const command = Command.sidecar(VIDEO_CMD_KEY.Download, [
    createDownloadArgs(url)
  ]);

  const output = await command.execute();

  if (output.stderr && output.stderr.length > 0) throw new Error(output.stderr);

  return parseDownloadResult(output.stdout);
};

const parseDownloadResult = (result: string) => {
  const parsed = JSON.parse(result);

  return parsed.data as number[];
};

const createDownloadArgs = (url: string) => {
  return JSON.stringify({
    ext: 'mp4',
    qualityLabel: '360p',
    url
  });
};
