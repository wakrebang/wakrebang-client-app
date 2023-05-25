import { resolve } from 'path';
import { EncryptBufferBody, IPCChannelBodyMap, WriteFileBody } from '..';
import { createFacadeAPI, facadeItem } from './base';
import { v1 } from 'uuid';

export const executeDownloadYoutubeVideo = createFacadeAPI<
  IPCChannelBodyMap['onRequestDownloadVideo'] & {
    cryptoOptions: EncryptBufferBody['cryptoOptions'];
  },
  string
>([
  facadeItem('onRequestDownloadVideo', (evt) => {
    return {
      buffer: evt.data!.buffer,
      cryptoOptions: (evt as any).body.cryptoOptions
    } satisfies EncryptBufferBody;
  }),
  facadeItem('onRequestEncryptBuffer', (evt) => {
    return {
      buffer: evt.data!.encryptedBuffer,
      fileLocation: resolve(__dirname, `./${v1()}.ysv`)
    } satisfies WriteFileBody;
  }),
  facadeItem('onRequestWriteFile', (evt, [, setValue]) => {
    setValue(evt.body.fileLocation);
    return true;
  })
]);
