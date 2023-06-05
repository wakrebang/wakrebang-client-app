import { invoke } from '@tauri-apps/api';
import { downloadDir, resolveResource } from '@tauri-apps/api/path';
import { Command } from '@tauri-apps/api/shell';

const VIDEO_CMD_KEY = {
  Download: '../bin/ytdl',
  DropStream: 'drop_stream',
  GetStreams: 'get_current_video_streams'
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

export const dropVideoStream = async (streamKey: string) => {
  return await invoke(VIDEO_CMD_KEY.DropStream, { streamKey });
};

export const getVideoStreams = async () => {
  return await invoke<string[]>(VIDEO_CMD_KEY.GetStreams);
};
