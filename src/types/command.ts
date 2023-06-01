export interface CryptoCommandParam {
  buffer: number[] | ArrayBuffer;
  keys: string[];
  clientId: string;
}

export type CryptoCommandResult = number[];

export type DownloadVideoResult = number[];
