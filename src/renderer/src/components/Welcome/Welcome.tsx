import { useState } from 'react';
import { cryptos } from '@wak/crypto';
// import { dispatchIPCChannel, registerReplyCallbackIPCChannel } from '@wak/ipc';

export const Welcome: React.FC = () => {
  const [localVideoUrl, setLocalVideoUrl] = useState<string | undefined>();

  const handleClick = async (): Promise<void> => {
    // const encryptedFileLocation = await window.wak.commands.downloadVideo({
    //   youtubeUrl: 'https://www.youtube.com/watch?v=1ePxevNqM2s&ab_channel=CLTH',
    //   cryptoOptions: [
    //     cryptos.createRawCryptoOption('aes-256-ctr', 'helloMyKey1'),
    //     cryptos.createRawCryptoOption('aes-256-ctr', 'helloMyKey2')
    //   ]
    // });
    // console.log(encryptedFileLocation);
    const videoBlob = await window.wak.commands.decryptedVideo({
      fileLocation: '~.ysv',
      cryptoOptions: [
        cryptos.createRawCryptoOption('aes-256-ctr', 'helloMyKey1'),
        cryptos.createRawCryptoOption('aes-256-ctr', 'helloMyKey2')
      ].reverse()
    });
    // console.log(videoBlob);

    setLocalVideoUrl(URL.createObjectURL(videoBlob));
  };

  return (
    <>
      <button onClick={handleClick}>다운로드</button>
      <video controls autoPlay src={localVideoUrl} />
    </>
  );
};

export default Welcome;
