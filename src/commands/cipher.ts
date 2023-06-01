import { CryptoCommandParam, CryptoCommandResult } from '@/types';
import { invoke } from '@tauri-apps/api';

const CIPHER_CMD_KEY = {
  Crypt: 'crypt'
};

export const encryptBuffer = async (
  param: CryptoCommandParam
): Promise<CryptoCommandResult> => await cryptBuffer(param);

export const decryptBuffer = async (
  param: CryptoCommandParam
): Promise<Blob> => {
  param.keys = [...param.keys].reverse();
  const result = await cryptBuffer(param);
  return new Blob([new Uint8Array(result)], { type: 'video/mp4' });
};

export const cryptBuffer = async (
  param: CryptoCommandParam
): Promise<CryptoCommandResult> => {
  const result = await invoke(CIPHER_CMD_KEY.Crypt, {
    buffer: param.buffer,
    clientId: param.clientId,
    keys: param.keys
  });
  return result as CryptoCommandResult;
};
