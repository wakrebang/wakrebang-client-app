import { useEffect, useState } from 'react';
// import { dispatchIPCChannel, registerReplyCallbackIPCChannel } from '@wak/ipc';

export const Welcome: React.FC = () => {
  const [localVideoUrl, setLocalVideoUrl] = useState<string | undefined>();

  useEffect(() => {
    const removeCallback = window.wak.registerReplyCallback(
      'onRequestDownloadVideo',
      (evt) => setLocalVideoUrl(evt.data?.fileLocation)
    );
    return removeCallback;
  }, [setLocalVideoUrl]);

  const handleClick = (): void => {
    window.wak.dispatch('onRequestDownloadVideo', {
      youtubeUrl: 'https://www.youtube.com/watch?v=1ePxevNqM2s&ab_channel=CLTH'
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
