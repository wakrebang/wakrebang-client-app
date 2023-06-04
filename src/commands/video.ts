import { downloadDir, resolveResource } from '@tauri-apps/api/path';
import { Command } from '@tauri-apps/api/shell';

const VIDEO_CMD_KEY = {
  Download: '../bin/ytdl'
};

export const downloadVideo = async (url: string) => {
  const command = Command.sidecar(VIDEO_CMD_KEY.Download, [
    url,
    await resolveResource('resources/ffmpeg-static'),
    await downloadDir()
  ]);

  const output = await command.execute();

  if (output.stderr && output.stderr.length > 0) throw new Error(output.stderr);

  return output.stdout;
};
