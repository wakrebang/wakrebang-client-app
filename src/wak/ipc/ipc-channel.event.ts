export type IPCChannelEvent<TData = unknown, TBody = unknown> = {
  eventTimestamp: Date;
  body: TBody;
  data?: TData;
  error?: IPCChannelEventError;
};

export interface DownloadVideoEvent {
  buffer: Buffer;
}
export interface EncryptBufferEvent {
  encryptedBuffer: Buffer;
}
export interface DecryptBufferEvent {
  decryptedBuffer: Buffer;
}
export interface LoadConfigurationEvent {
  data: any; // TODO Make Config Interface
}

export interface RemoveFileEvent {
  success?: boolean;
}
export interface WriteFileEvent {
  success?: boolean;
}

export interface ReadFileEvent {
  buffer: Buffer;
}

export interface IPCChannelEventMap {
  //#region Render -> Main
  /**
   * Youtube 비디오를 다운로드 결과 객체
   */
  onRequestDownloadVideo: DownloadVideoEvent;
  /**
   * 다운로드된 비디오를 암호화 결과 객체
   */
  onRequestEncryptBuffer: EncryptBufferEvent;
  /**
   * 암호화된 비디오를 복호화 결과 객체
   */
  onRequestDecryptBuffer: DecryptBufferEvent;
  /**
   * 여러 환경 설정 파일 읽기를 결과 객체
   */
  onRequestLoadConfiguration: LoadConfigurationEvent;

  onRequestDoNotUse: undefined;

  onRequestRemoveFile: RemoveFileEvent;

  onRequestWriteFile: WriteFileEvent;

  onRequestReadFile: ReadFileEvent;
}

export type ReplyIPCChannelEvent<T extends string> = `reply${Capitalize<T>}`;

export class IPCChannelEventError extends Error {
  channelType: keyof IPCChannelEventMap;
  description: string;
  error: any;

  constructor(
    channelType: IPCChannelEventError['channelType'],
    description: IPCChannelEventError['description'],
    error: IPCChannelEventError['error']
  ) {
    super();
    this.channelType = channelType;
    this.description = description;
    this.error = error;
  }

  get message(): string {
    return this.toString();
  }

  toString(): string {
    return `[IPCChannelError:${this.channelType}] Fail Channel Job from "${
      this.description
    }"\ninfo: ${JSON.stringify(this.error, null, 2)}`;
  }

  public static of(
    ...args: ConstructorParameters<typeof IPCChannelEventError>
  ): IPCChannelEventError {
    return new this(...args);
  }
}
