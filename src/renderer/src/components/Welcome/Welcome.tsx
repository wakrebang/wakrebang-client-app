import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { cryptos } from '@wak/crypto';
// import { dispatchIPCChannel, registerReplyCallbackIPCChannel } from '@wak/ipc';

export const Welcome: React.FC = () => {
  const [localVideoUrl] = useState<string | undefined>();

  // useEffect(() => {
  //   const removeCallback = window.wak.registerReplyCallback(
  //     'onRequestDownloadVideo',
  //     (evt) => setLocalVideoUrl(evt.data?.fileLocation)
  //   );
  //   return removeCallback;
  // }, [setLocalVideoUrl]);

  const handleClick = (): void => {
    // window.wak.dispatch('onRequestDownloadVideo', {
    //   youtubeUrl: 'https://www.youtube.com/watch?v=1ePxevNqM2s&ab_channel=CLTH'
    // });
    window.wak.commands
      .downloadVideo({
        youtubeUrl:
          'https://www.youtube.com/watch?v=1ePxevNqM2s&ab_channel=CLTH',
        savedFileName: uuid(),
        cryptoOptions: [
          cryptos.createRawCryptoOption('aes-256-gcm', 'helloMyKey1'),
          cryptos.createRawCryptoOption('aes-256-gcm', 'helloMyKey2')
        ]
      })
      .then((s) => {
        console.log(s);
      });
  };

  return (
    <>
      <button onClick={handleClick}>다운로드</button>
      <video
        controls
        autoPlay
        src={localVideoUrl ? `local-resource://${localVideoUrl}` : ''}
      ></video>
    </>
  );
};

export default Welcome;
