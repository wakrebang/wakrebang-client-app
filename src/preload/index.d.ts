import { ElectronAPI } from '@electron-toolkit/preload';
import { wakAPI as WakIPC } from '@wak/api';

declare global {
  interface Window {
    electron: ElectronAPI;
    wak: typeof WakIPC;
  }
}
