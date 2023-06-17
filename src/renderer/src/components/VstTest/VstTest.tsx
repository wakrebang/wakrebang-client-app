import { useEffect, useRef, useState } from 'react';
import {
  Meter,
  UserMedia,
  Reverb,
  start,
  getDestination,
  Player,
  PitchShift
} from 'tone';

// 2023-06-07 게인으로 조절은 마이크만 됨 리버브는 줄어들지 않음 전체 볼륨 조절을 찾아야 함 아마 volume 예상

export const VstTest: React.FC = () => {
  const micRef = useRef<UserMedia | null>(null);
  const reverbRef = useRef<Reverb | null>(null);
  const meterRef = useRef<Meter | null>(null);
  const playerRef = useRef<Player | null>(null);
  const pitchRef = useRef<PitchShift>(new PitchShift().toDestination());

  const audioContextRef = useRef<AudioContext | null>(null);
  const [volume, setVolume] = useState<number>(-10);
  const [wet, setWet] = useState<number>(50);
  const [mute, setMute] = useState<boolean>(false);
  const [pitch, setPitch] = useState<number>(0);

  useEffect(() => {
    const startLatencyMeasurement = async () => {
      try {
        playerRef.current = new Player({
          url: 'assets/test.mp3',
          loop: true,
          autostart: true
        });
        playerRef.current.connect(pitchRef.current);
        // playerRef.current.autostart = true;

        audioContextRef.current = new AudioContext();
        meterRef.current = new Meter();
        micRef.current = new UserMedia().toDestination();
        reverbRef.current = new Reverb().toDestination();

        micRef.current.open();
        micRef.current.connect(reverbRef.current);
        micRef.current.connect(meterRef.current);
        // setInterval(() => console.log(meterRef.current.getValue()), 100);
        start();
      } catch (error) {
        console.error('마이크 스트림을 얻는 동안 오류가 발생했습니다:', error);
      }
    };

    const stopLatencyMeasurement = () => {
      // 재생 중지 및 위치 초기화
      micRef.current?.close();
      playerRef.current?.stop();
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
    reverbRef.current?.wet.setValueAtTime(
      wet / 100,
      audioContextRef.current?.currentTime || 0
    );
  }, [wet]);

  useEffect(() => {
    getDestination().mute = mute;
  }, [mute]);

  useEffect(() => {
    pitchRef.current.pitch = pitch;
  }, [pitch]);

  return (
    <>
      <p>VST TEST</p>
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

      <input
        type="range"
        max="12"
        min="-12"
        value={pitch}
        onChange={(e) => setPitch(+e.target.value)}
        onDoubleClick={() => setPitch(0)}
      />
      <p>{pitch}</p>
    </>
  );
};

export default VstTest;
