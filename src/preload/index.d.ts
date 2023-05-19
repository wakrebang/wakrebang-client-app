import { ElectronAPI } from '@electron-toolkit/preload';
import { channels as WakIPC } from '@wak/ipc';

declare global {
  interface Window {
    electron: ElectronAPI;
    wak: typeof WakIPC;
  }
}
