import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { cryptos } from '@wak/crypto';
// import { dispatchIPCChannel, registerReplyCallbackIPCChannel } from '@wak/ipc';

export const Welcome: React.FC = () => {
  const [localVideoUrl, setLocalVideoUrl] = useState<string | undefined>();

  const handleClick = async (): Promise<void> => {
    const encryptedFileLocation = await window.wak.commands.downloadVideo({
      youtubeUrl: 'https://www.youtube.com/watch?v=1ePxevNqM2s&ab_channel=CLTH',
      savedFileName: uuid(),
      cryptoOptions: [
        cryptos.createRawCryptoOption('aes-256-ctr', 'helloMyKey1'),
        cryptos.createRawCryptoOption('aes-256-ctr', 'helloMyKey2')
      ]
    });
    // console.log(encryptedFileLocation);
    const decryptedFileLocation = await window.wak.commands.decryptedVideo({
      encryptedFileLocation: encryptedFileLocation,
      cryptoOptions: [
        cryptos.createRawCryptoOption('aes-256-ctr', 'helloMyKey1'),
        cryptos.createRawCryptoOption('aes-256-ctr', 'helloMyKey2')
      ].reverse()
    });
    setLocalVideoUrl(decryptedFileLocation);
  };

  return (
    <>
      <button onClick={handleClick}>다운로드</button>
      <video
        controls
        autoPlay
        src={localVideoUrl ? `local-resource://${localVideoUrl}` : ''}
      />
    </>
  );
};

export default Welcome;
