import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { wakAPI } from '@wak/api';

// Custom APIs for renderer
const wak = wakAPI;

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('wak', wak);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.wak = wak;
}
