import { EncryptVideoBody, IPCChannelBodyMap, RemoveFileBody } from '..';
import { createFacadeAPI, facadeItem } from './base';

export const executeDownloadYoutubeVideo = createFacadeAPI<
  IPCChannelBodyMap['onRequestDownloadVideo'] & {
    cryptoOptions: EncryptVideoBody['cryptoOptions'];
  },
  string
>([
  facadeItem('onRequestDownloadVideo', (evt) => {
    return {
      rawFileLocation: evt.data!.fileLocation,
      cryptoOptions: (evt as any).body.cryptoOptions
    } satisfies EncryptVideoBody;
  }),
  facadeItem('onRequestEncryptVideo', (evt, [, setValue]) => {
    setValue(evt.data!.encryptedFileLocation);
    return {
      fileLocation: evt.body.rawFileLocation
    } satisfies RemoveFileBody;
  }),
  facadeItem('onRequestRemoveFile', (evt) => {
    return evt.body.fileLocation;
  })
]);
