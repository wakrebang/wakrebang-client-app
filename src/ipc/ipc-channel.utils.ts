import { ipcMain, ipcRenderer } from 'electron';

import { IPCChannelEventMap, ReplyIPCChannelEvent } from './ipc-channel.event';
import {
  IPCChannelBodyMap,
  IPCChannelWithBody,
  IPCChannelWithoutBody,
  IPCChannelBody
} from './ipc-channel.body';

//#region dispatchIPCChannel

function dispatchIPCChannel<K extends keyof IPCChannelWithoutBody>(channelType: K): void;
function dispatchIPCChannel<K extends keyof IPCChannelWithBody>(
  channelType: K,
  channelBody: IPCChannelWithBody[K]
): void;
function dispatchIPCChannel<K extends keyof IPCChannelBodyMap>(
  channelType: K,
  channelBody?: IPCChannelBodyMap[K]
): void {
  const __channelBody: IPCChannelBodyMap[K] & IPCChannelBody = {
    ...((typeof channelBody === 'object' ? channelBody : {}) as IPCChannelBodyMap[K]),
    requestTimestamp: new Date()
  };

  ipcRenderer.send(channelType, __channelBody);
}

function registerHandlerIPCChannel<K extends keyof IPCChannelBodyMap>(
  channelType: K,
  handler: (body: IPCChannelBodyMap[K] & IPCChannelBody) => IPCChannelEventMap[K]
): void {
  ipcMain.on(channelType, (evt, chlBody: IPCChannelBodyMap[K] & IPCChannelBody) => {
    const replyChannelTypeWithCapitalized =
      'reply' + channelType.charAt(0).toUpperCase() + channelType.slice(1);

    evt.reply(replyChannelTypeWithCapitalized, handler(chlBody));
  });
}

function registerReplyCallbackIPCChannel<K extends keyof IPCChannelEventMap>(
  replyChannelType: ReplyIPCChannelEvent<K>,
  callback: (evt: IPCChannelEventMap[K]) => void
): void {
  ipcRenderer.on(replyChannelType, (_evt, chlEvent: IPCChannelEventMap[K]) => callback(chlEvent));
}

export { dispatchIPCChannel, registerHandlerIPCChannel, registerReplyCallbackIPCChannel };
