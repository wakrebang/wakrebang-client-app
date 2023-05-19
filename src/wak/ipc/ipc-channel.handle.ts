import { channels } from './ipc-channel.utils';
import { downloadFromYoutube } from '@wak/youtube';

const item = channels.handlerItem;

const handlers = [
  item('onRequestDownloadVideo', async (body) => {
    const videoFilePath = await downloadFromYoutube(
      body.youtubeUrl,
      '/Users/byungjin/Lab/wakrebang/wakrebang-client-app/1.mp4'
    );

    return {
      fileLocation: videoFilePath
    };
  }),
  item('onRequestLoadConfiguration', async () => {
    return {
      data: ''
    };
  })
  // item('onRequestEncryptVideo', async (body) => {})
];

export const setupIPCChannelHandler = (): void => {
  handlers.forEach(({ channelType, handler }) =>
    channels.registerHandler(channelType, handler as any)
  );
};

export default setupIPCChannelHandler;
