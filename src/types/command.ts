export interface EncryptFileCommandParam extends SecretObject {
  path: string;
  destination: string;
}

export interface DecryptFileCommandParam extends SecretObject {
  streamKey: string;
  path: string;
  enable?: boolean;
}

interface SecretObject {
  keys: string[];
  clientId: string;
}

export type CryptoCommandResult = number[];

export type DownloadVideoResult = number[];
