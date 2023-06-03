import { useEffect, useRef, useState } from 'react';

export const VstTest: React.FC = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [latency, setLatency] = useState<string>('');

  useEffect(() => {
    const startLatencyMeasurement = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
        audioContextRef.current = new window.AudioContext();
        analyzerRef.current = audioContextRef.current.createAnalyser();
        gainNodeRef.current = audioContextRef.current.createGain();
        const source = audioContextRef.current.createMediaStreamSource(stream);

        source.connect(gainNodeRef.current);
        gainNodeRef.current.connect(audioContextRef.current.destination);

        source.connect(analyzerRef.current);

        intervalRef.current = setInterval(() => {
          if (!audioContextRef.current || !analyzerRef.current) return;
          const dataArray = new Uint8Array(
            analyzerRef.current.frequencyBinCount
          );
          analyzerRef.current.getByteTimeDomainData(dataArray);
          const maxAmplitude = Math.max(...dataArray);
          const bufferLength = dataArray.length;
          const sampleRate = audioContextRef.current.sampleRate;
          const latency = Math.round((bufferLength / sampleRate) * 1000);
          setLatency(`레이턴시: ${latency}ms, 최대 진폭: ${maxAmplitude}`);
          console.log(`레이턴시: ${latency}ms, 최대 진폭: ${maxAmplitude}`);
        }, 1000);
      } catch (error) {
        console.error('마이크 스트림을 얻는 동안 오류가 발생했습니다:', error);
      }
    };

    const stopLatencyMeasurement = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };

    startLatencyMeasurement();
    return stopLatencyMeasurement;
  }, []);

  return (
    <>
      <p>VST TEST</p>
      <p>{latency}</p>
    </>
  );
};

export default VstTest;
