import { useEffect } from 'react';
// import { dispatchIPCChannel, registerReplyCallbackIPCChannel } from '@wak/ipc';

export const Welcome: React.FC = () => {
  useEffect(() => {
    const removeCallback = window.wak.registerReplyCallback('onRequestDownloadVideo', (evt) => {
      alert(evt.data?.fileLocation);
    });
    return removeCallback;
  }, []);

  const handleClick = (): void => {
    window.wak.dispatch('onRequestDownloadVideo', {
      youtubeUrl: 'https://www.youtube.com/watch?v=1ePxevNqM2s&ab_channel=CLTH'
    });
  };

  return <button onClick={handleClick}>다운로드</button>;
};

export default Welcome;
