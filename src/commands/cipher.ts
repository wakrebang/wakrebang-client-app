import { DecryptFileCommandParam, EncryptFileCommandParam } from '@/types';
import { invoke } from '@tauri-apps/api';

const CIPHER_CMD_KEY = {
  EncryptFile: 'encrypt_file',
  DecryptFile: 'decrypt_file'
};

export const encryptFile = async (
  param: EncryptFileCommandParam
): Promise<string> =>
  await invoke(CIPHER_CMD_KEY.EncryptFile, {
    path: param.path,
    destination: param.destination,
    keys: param.keys,
    clientId: param.clientId
  });

export const decryptFile = async (
  param: DecryptFileCommandParam
): Promise<Blob> => {
  param.keys = [...param.keys].reverse();
  const result = await invoke<number[]>(CIPHER_CMD_KEY.DecryptFile, {
    path: param.path,
    keys: param.keys,
    clientId: param.clientId
  });
  return new Blob([new Uint8Array(result)], { type: 'video/mp4' });
};
