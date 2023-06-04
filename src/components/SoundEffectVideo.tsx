import { useRef } from 'react';
import { BlobVideo, BlobVideoProps } from '.';

export const SoundEffectVideo: React.FC<BlobVideoProps> = ({ blob }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  console.log(blob);

  const triggerSoundEffect: React.ReactEventHandler<HTMLVideoElement> = (e) => {
    const audioContext = new AudioContext();

    const source = audioContext.createMediaElementSource(
      e.target as HTMLVideoElement
    );

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1;

    source.connect(gainNode).connect(audioContext.destination);
  };

  return <BlobVideo ref={videoRef} blob={blob} onLoaded={triggerSoundEffect} />;
};
