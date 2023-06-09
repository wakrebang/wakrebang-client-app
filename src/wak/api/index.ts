import { executeDecryptedVideo, executeDownloadYoutubeVideo } from '../facade';
import { channels } from '../ipc';

export const wakAPI = {
  channels: channels,
  commands: {
    downloadVideo: executeDownloadYoutubeVideo,
    decryptedVideo: executeDecryptedVideo
  }
};
