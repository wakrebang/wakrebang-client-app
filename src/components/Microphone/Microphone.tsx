import { microphoneStore } from '@/stores';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { getAudioContext, getVoiceStream } from './util';

const threshold = -24;
const attack = 0.003;
const release = 0.25;
const ratio = 12;
const knee = 30;

const work = async (context: AudioContext) => {
  const voiceSourceNode = context.createMediaStreamSource(
    await getVoiceStream()
  );
  const compressorNode = context.createDynamicsCompressor();

  compressorNode.threshold.setValueAtTime(threshold, context.currentTime);
  compressorNode.attack.setValueAtTime(attack, context.currentTime);
  compressorNode.release.setValueAtTime(release, context.currentTime);
  compressorNode.ratio.setValueAtTime(ratio, context.currentTime);
  compressorNode.knee.setValueAtTime(knee, context.currentTime);

  voiceSourceNode.connect(compressorNode).connect(context.destination);
};

export const Microphone: React.FC = () => {
  const config = useRecoilValue(microphoneStore);

  useEffect(() => {
    const context = getAudioContext();
    work(context);
    return () => {
      context.close();
    };
  }, [config]);

  return <></>;
};

export default Microphone;
