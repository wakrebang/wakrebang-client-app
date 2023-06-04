import { atom } from 'recoil';

export interface ConfigStore {
  volume: number;
}

export const configStore = atom<ConfigStore | null>({
  key: 'config',
  default: null
});
