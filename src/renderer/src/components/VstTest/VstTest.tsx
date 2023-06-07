import { useEffect, useRef, useState } from 'react';
import { Meter, UserMedia, Reverb, start, getDestination } from 'tone';

// 2023-06-07 게인으로 조절은 마이크만 됨 리버브는 줄어들지 않음 전체 볼륨 조절을 찾아야 함 아마 volume 예상

export const VstTest: React.FC = () => {
  const micRef = useRef<UserMedia | null>(null);
  const reverbRef = useRef<Reverb | null>(null);
  const meterRef = useRef<Meter | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [latency, setLatency] = useState<string>('');
  const [volume, setVolume] = useState<number>(0);
  const [wet, setWet] = useState<number>(50);
  const [mute, setMute] = useState<boolean>(false);

  useEffect(() => {
    const startLatencyMeasurement = async () => {
      try {
        audioContextRef.current = new AudioContext();
        meterRef.current = new Meter();
        micRef.current = new UserMedia().toDestination();
        reverbRef.current = new Reverb().toDestination();

        micRef.current.open();
        micRef.current.connect(reverbRef.current);
        micRef.current.connect(meterRef.current);
        // setInterval(() => console.log(meterRef.current.getValue()), 100);
        start();

        // const stream = await navigator.mediaDevices.getUserMedia({
        //   audio: true
        // });
        // audioContextRef.current = new window.AudioContext();
        // analyzerRef.current = audioContextRef.current.createAnalyser();
        // gainNodeRef.current = audioContextRef.createGain();
        // const source = audioContextRef.current.createMediaStreamSource(stream);

        // source.connect(gainNodeRef.current);
        // gainNodeRef.current.connect(audioContextRef.current.destination);

        // source.connect(analyzerRef.current);

        // intervalRef.current = setInterval(() => {
        //   if (!audioContextRef.current || !analyzerRef.current) return;
        //   const dataArray = new Uint8Array(
        //     analyzerRef.current.frequencyBinCount
        //   );
        //   analyzerRef.current.getByteTimeDomainData(dataArray);
        //   const maxAmplitude = Math.max(...dataArray);
        //   const bufferLength = dataArray.length;
        //   const sampleRate = audioContextRef.current.sampleRate;
        //   const latency = Math.round((bufferLength / sampleRate) * 1000);
        //   setLatency(`레이턴시: ${latency}ms, 최대 진폭: ${maxAmplitude}`);
        // }, 100);
      } catch (error) {
        console.error('마이크 스트림을 얻는 동안 오류가 발생했습니다:', error);
      }
    };

    const stopLatencyMeasurement = () => {
      // 재생 중지 및 위치 초기화
      micRef.current?.close();
    };

    startLatencyMeasurement();
    return stopLatencyMeasurement;
  }, []);

  useEffect(() => {
    getDestination().volume.setValueAtTime(
      volume,
      audioContextRef.current?.currentTime || 0
    );
  }, [volume]);
  useEffect(() => {
    console.log(wet);
    reverbRef.current?.wet.setValueAtTime(
      wet / 100,
      audioContextRef.current?.currentTime || 0
    );
  }, [wet]);

  useEffect(() => {
    getDestination().mute = mute;
  }, [mute]);

  return (
    <>
      <p>VST TEST</p>
      <p>{latency}</p>
      <p>volume</p>
      <input
        type="range"
        max="5"
        min="-70"
        value={volume}
        onChange={(e) => setVolume(+e.target.value)}
        onDoubleClick={() => setVolume(0)}
      />
      <p>wet</p>
      <input
        type="range"
        max="100"
        min="0"
        value={wet}
        onChange={(e) => setWet(+e.target.value)}
        onDoubleClick={() => setWet(50)}
      />
      <button onClick={() => setMute(!mute)} className="block border p-2">
        {mute ? 'mute' : 'no mute'}
      </button>
    </>
  );
};

export default VstTest;
