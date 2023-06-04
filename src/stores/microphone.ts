import { atom } from 'recoil';

export interface MicrophoneStore {
  volume: number;
}

export const microphoneStore = atom<MicrophoneStore | null>({
  key: 'microphone',
  default: null
});
