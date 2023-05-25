import { DecryptBufferBody, IPCChannelBodyMap } from '..';
import { createFacadeAPI, facadeItem } from './base';

export const executeDecryptedVideo = createFacadeAPI<
  IPCChannelBodyMap['onRequestReadFile'] & {
    cryptoOptions: DecryptBufferBody['cryptoOptions'];
  },
  Blob
>([
  facadeItem('onRequestReadFile', (evt) => {
    return {
      buffer: evt.data!.buffer,
      cryptoOptions: (evt as any).body.cryptoOptions
    } satisfies DecryptBufferBody;
  }),
  facadeItem('onRequestDecryptBuffer', (evt, [, setValue]) => {
    setValue(new Blob([evt.data!.decryptedBuffer], { type: 'video/mp4' }));
    return true;
  })
]);
