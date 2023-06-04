const SAMPLE_RATE = 48000;

export const getAudioContext = () =>
  new AudioContext({
    sampleRate: SAMPLE_RATE
  });

export const getAudioIODevices = async () => {
  await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  const devices = await navigator.mediaDevices.enumerateDevices();
  return {
    inputs: devices.filter((device) => device.kind === 'audioinput'),
    outputs: devices.filter((device) => device.kind === 'audiooutput')
  };
};

const DEFAULT_CONSTRAINTS: MediaTrackConstraints = {
  channelCount: 2,
  sampleRate: SAMPLE_RATE
};

export const getVoiceStream = async (option?: MediaTrackConstraints) => {
  const source = await navigator.mediaDevices.getUserMedia({
    audio: { ...DEFAULT_CONSTRAINTS, ...(option ?? {}) },
    video: false
  });

  return source;
};
