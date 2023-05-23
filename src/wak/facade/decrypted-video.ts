import { IPCChannelBodyMap } from '..';
import { createFacadeAPI, facadeItem } from './base';

export const executeDecryptedVideo = createFacadeAPI<
  IPCChannelBodyMap['onRequestDecryptVideo'],
  string
>([
  facadeItem('onRequestDecryptVideo', (evt, [, setValue]) => {
    console.log(evt);
    setValue(evt.data?.decryptedFileLocation);
    return;
  })
]);
