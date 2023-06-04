import { decryptFile, downloadVideo, encryptFile } from '@/commands';
import { BlobVideo } from '@/components';
import { useState } from 'react';

const TEST_KEYS = ['123123'];
const TEST_CLIENT_ID = 'test';

export const Home: React.FC = () => {
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const triggerDownload = async () => {
    const outputPath = await downloadVideo(
      'https://www.youtube.com/watch?v=KjySNSxgg3U'
    );
    await encryptFile({
      path: outputPath,
      destination: '/Users/byungjin/Downloads/test.mp4',
      clientId: TEST_CLIENT_ID,
      keys: TEST_KEYS
    });
    console.log('done');
  };

  const triggerLoadVideo = async () => {
    const blob = await decryptFile({
      path: '/Users/byungjin/Downloads/test.mp4',
      keys: TEST_KEYS,
      clientId: TEST_CLIENT_ID
    });
    setVideoBlob(blob);
  };
  return (
    <>
      <h1>Home</h1>
      {/* <SoundEffectVideo blob={videoBlob} /> */}
      <BlobVideo blob={videoBlob} />
      {/* <ReactPlayer
        url={videoBlob ? URL.createObjectURL(videoBlob) : ''}
        playing
      /> */}
      <button onClick={triggerDownload}>다운로드</button>
      <br />
      <button onClick={triggerLoadVideo}>로드</button>
    </>
  );
};

export default Home;
