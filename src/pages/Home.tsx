import {
  decryptBuffer,
  downloadVideo,
  encryptBuffer,
  readFile,
  saveFile
} from '@/commands';
import { BlobVideo } from '@components/BlobVideo';
import { useState } from 'react';

const TEST_KEYS = ['123123', '321321'];
const TEST_CLIENT_ID = 'test';

export const Home: React.FC = () => {
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);

  const triggerDownload = async () => {
    const buffer = await downloadVideo(
      'https://www.youtube.com/watch?v=zxVzfCawDyE'
    );
    const result = await encryptBuffer({
      buffer: buffer,
      clientId: TEST_CLIENT_ID,
      keys: TEST_KEYS
    });
    saveFile('/Users/byungjin/Downloads/test.mp4', result);
  };

  const triggerLoadVideo = async () => {
    const buffer = await readFile('/Users/byungjin/Downloads/test.mp4');
    const blob = await decryptBuffer({
      buffer: Array.from(buffer),
      keys: TEST_KEYS,
      clientId: TEST_CLIENT_ID
    });
    setVideoBlob(blob);
  };
  return (
    <>
      <h1>Home</h1>
      <BlobVideo blob={videoBlob} />
      <button onClick={triggerDownload}>다운로드</button>
      <button onClick={triggerLoadVideo}>로드</button>
    </>
  );
};

export default Home;
