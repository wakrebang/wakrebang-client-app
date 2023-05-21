import {
  IPCChannelBodyMap,
  IPCChannelEvent,
  IPCChannelEventMap,
  channels
} from '..';

export const facadeItem = <T extends keyof IPCChannelBodyMap>(
  channelType: T,
  next: (
    evt: IPCChannelEvent<IPCChannelEventMap[T], IPCChannelBodyMap[T]>,
    store: [any, (value: any) => void]
  ) => any = (e) => e
) => ({
  channelType,
  next
});

export const createFacadeAPI = <TStartParam, TResult>(
  items: { channelType: keyof IPCChannelBodyMap; next: any }[]
) => {
  const execute = async (param: TStartParam): Promise<TResult> => {
    let p: any = param,
      stored: any;
    const setStoredValue = (val: any) => {
      stored = val;
    };
    for (const it of items) {
      const evt = await new Promise<IPCChannelEventMap[typeof it.channelType]>(
        (resolve) => {
          channels.registerReplyCallbackOnce(it.channelType, resolve as any);
          channels.dispatch(it.channelType as any, p);
        }
      );
      p = it.next(evt, [stored, setStoredValue]);
    }
    return stored;
  };
  return execute;
};
