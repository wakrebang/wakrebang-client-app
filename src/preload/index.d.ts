import { ElectronAPI } from '@electron-toolkit/preload';
import * as WakIPC from '@wak/ipc';

declare global {
  interface Window {
    electron: ElectronAPI;
    wak: typeof WakIPC;
  }
}
