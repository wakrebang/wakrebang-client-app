import { downloadFromYoutube } from '@wak/youtube';
import { cryptos } from '@wak/crypto';
import { resolve } from 'path';
import { v1 as uuid } from 'uuid';
import { unlink } from 'fs';
import { channels } from './ipc-channel.utils';

const item = channels.handlerItem;

const handlers = [
  item('onRequestDownloadVideo', async (body) => {
    const videoFilePath = await downloadFromYoutube(
      body.youtubeUrl,
      `/Users/byungjin/Lab/wakrebang/wakrebang-client-app/${body.savedFileName}.mp4`
    );

    return {
      fileLocation: videoFilePath
    };
  }),
  item('onRequestLoadConfiguration', async () => {
    return {
      data: ''
    };
  }),
  item('onRequestEncryptVideo', async (body) => {
    const destinationLocation = resolve(__dirname, `./${uuid()}.yrs`);
    await cryptos.encryptFile(
      body.rawFileLocation,
      destinationLocation,
      body.cryptoOptions.map(cryptos.createCryptoOptionFromRaw)
    );

    return {
      encryptedFileLocation: destinationLocation
    };
  }),
  item('onRequestDecryptVideo', async (body) => {
    const destinationLocation = resolve(__dirname, `./${uuid()}.mp4`);
    await cryptos.decryptFile(
      body.encryptedFileLocation,
      destinationLocation,
      body.cryptoOptions.map(cryptos.createCryptoOptionFromRaw)
    );
    return {
      decryptedFileLocation: destinationLocation
    };
  }),
  item('onRequestRemoveFile', async (body) => {
    unlink(body.fileLocation, (err) => err);
    return {};
  })
];

export const setupIPCChannelHandler = (): void => {
  handlers.forEach(({ channelType, handler }) =>
    channels.registerHandler(channelType, handler as any)
  );
};

export default setupIPCChannelHandler;
