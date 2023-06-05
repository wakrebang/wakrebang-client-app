import { DecryptFileCommandParam, EncryptFileCommandParam } from '@/types';
import { invoke } from '@tauri-apps/api';

const CIPHER_CMD_KEY = {
  EncryptFile: 'encrypt_file',
  DecryptStream: 'decrypt_stream'
};

export const encryptFile = async (
  param: EncryptFileCommandParam
): Promise<boolean> =>
  await invoke(CIPHER_CMD_KEY.EncryptFile, {
    path: param.path,
    destination: param.destination,
    keys: param.keys,
    clientId: param.clientId
  });

export const decryptStream = async (
  param: DecryptFileCommandParam
): Promise<boolean> => {
  param.keys = [...param.keys].reverse();
  return await invoke(CIPHER_CMD_KEY.DecryptStream, {
    streamKey: param.streamKey,
    path: param.path,
    keys: param.keys,
    clientId: param.clientId,
    enable: param.enable ?? true
  });
};
