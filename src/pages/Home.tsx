import {
  decryptStream,
  downloadVideo,
  dropVideoStream,
  encryptFile,
  getVideoStreams
} from '@/commands';
// import { prompt } from '@tauri-apps/api/dialog';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { useState } from 'react';

const TEST_KEYS = ['123123'];
const TEST_CLIENT_ID = 'test';

export const Home: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [url, setUrl] = useState('');
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
    if (
      await decryptStream({
        path: '/Users/byungjin/Downloads/test.mp4',
        clientId: TEST_CLIENT_ID,
        keys: TEST_KEYS,
        streamKey: 'test',
        enable: true
      })
    ) {
      setVideoSrc(convertFileSrc('test', 'video-stream'));
    }
  };

  const triggerCurrentStreams = async () => {
    console.log(await getVideoStreams());
  };

  const triggerDropStream = async () => {
    await dropVideoStream('test');
  };

  const triggerRoutine = async () => {
    console.log('firsht');

    if (!url || url.length < 3) return;

    const key = 'test1';
    const destination = '/Users/byungjin/Downloads/d.mp4';

    const outputPath = await downloadVideo(url);
    await encryptFile({
      path: outputPath,
      destination: destination,
      clientId: TEST_CLIENT_ID,
      keys: TEST_KEYS
    });

    if (
      await decryptStream({
        path: destination,
        clientId: TEST_CLIENT_ID,
        keys: TEST_KEYS,
        streamKey: key,
        enable: true
      })
    ) {
      setVideoSrc(convertFileSrc(key, 'video-stream'));
    }
  };

  return (
    <>
      <h1>Home</h1>
      {/* <SoundEffectVideo blob={videoBlob} /> */}
      {/* <BlobVideo blob={videoBlob} /> */}
      <video
        controls
        autoPlay
        preload="metadata"
        src={videoSrc}
        onLoad={() => {
          console.log('loading');
        }}
      ></video>
      {/* <ReactPlayer url={videoSrc} /> */}
      <button onClick={triggerDownload}>다운로드</button>
      <br />
      <button onClick={triggerLoadVideo}>로드</button>
      <br />
      <button onClick={triggerCurrentStreams}>스트림</button>
      <br />
      <button onClick={triggerDropStream}>드랍</button>
      <br />
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={triggerRoutine}>루틴</button>
    </>
  );
};

export default Home;
