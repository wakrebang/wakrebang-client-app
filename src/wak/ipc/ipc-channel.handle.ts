import { downloadFromYoutube } from '@wak/youtube';
import { cryptos } from '@wak/crypto';
import { unlink } from 'fs';
import { channels } from './ipc-channel.utils';
import { readFileNonBlocking, writeFileNonBlocking } from '@wak/file/file';

const item = channels.handlerItem;

const handlers = [
  item('onRequestDownloadVideo', async (body) => {
    const buffer = await downloadFromYoutube(body.youtubeUrl);
    return {
      buffer
    };
  }),
  item('onRequestLoadConfiguration', async () => {
    return {
      data: ''
    };
  }),
  item('onRequestEncryptBuffer', async (body) => {
    const buffer = cryptos.encryptBufferMultipleOptions(
      body.buffer,
      body.cryptoOptions.map(cryptos.createCryptoOptionFromRaw)
    );

    return {
      encryptedBuffer: buffer
    };
  }),
  item('onRequestDecryptBuffer', async (body) => {
    const buffer = cryptos.decryptBufferMultipleOptions(
      body.buffer,
      body.cryptoOptions.map(cryptos.createCryptoOptionFromRaw)
    );
    return {
      decryptedBuffer: buffer
    };
  }),
  item('onRequestRemoveFile', async (body) => {
    unlink(body.fileLocation, (err) => err);
    return {};
  }),
  item('onRequestReadFile', async (body) => {
    return {
      buffer: await readFileNonBlocking(body.fileLocation)
    };
  }),
  item('onRequestWriteFile', async (body) => {
    await writeFileNonBlocking(body.fileLocation, body.buffer);
    return {};
  })
];

export const setupIPCChannelHandler = (): void => {
  handlers.forEach(({ channelType, handler }) =>
    channels.registerHandler(channelType, handler as any)
  );
};

export default setupIPCChannelHandler;
