import { ipcMain, ipcRenderer } from 'electron';

import { IPCChannelEvent, IPCChannelEventError, IPCChannelEventMap } from './ipc-channel.event';
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

function computeReplyChannelType<K extends keyof IPCChannelEventMap>(channelType: K): string {
  return 'reply' + channelType.charAt(0).toUpperCase() + channelType.slice(1);
}

function registerHandlerIPCChannel<K extends keyof IPCChannelBodyMap>(
  channelType: K,
  handler: (body: IPCChannelBodyMap[K] & IPCChannelBody) => Promise<IPCChannelEventMap[K]>
): void {
  ipcMain.on(channelType, async (evt, chlBody: IPCChannelBodyMap[K] & IPCChannelBody) => {
    const result: IPCChannelEvent<IPCChannelEventMap[K], typeof chlBody> = {
      body: chlBody,
      eventTimestamp: new Date()
    };
    try {
      result.data = await handler(chlBody);
    } catch (error) {
      result.error = IPCChannelEventError.of(
        channelType,
        'Channel Handler를 실행하는 도중 오류가 발생하였습니다.',
        error
      );
    }

    evt.reply(computeReplyChannelType(channelType), result);
  });
}

function registerReplyCallbackIPCChannel<K extends keyof IPCChannelEventMap>(
  channelType: K,
  callback: (evt: IPCChannelEventMap[K]) => void
): () => void {
  const replyChannelType = computeReplyChannelType(channelType);

  const __callback = (_evt, chlEvent: IPCChannelEventMap[K]): void => callback(chlEvent);

  ipcRenderer.on(replyChannelType, __callback);

  // return remove Function
  return () => {
    ipcRenderer.removeListener(replyChannelType, __callback);
  };
}

export { dispatchIPCChannel, registerHandlerIPCChannel, registerReplyCallbackIPCChannel };
