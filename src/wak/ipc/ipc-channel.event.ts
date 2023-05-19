export type IPCChannelEvent<E = unknown, Body = unknown> = {
  eventTimestamp: Date;
  body: Body;
  data?: E;
  error?: IPCChannelEventError;
};

export interface DownloadVideoEvent {
  fileLocation: string;
}
export interface EncryptVideoEvent {
  encryptedFileLocation: string;
}
export interface DecryptVideoEvent {
  decryptedFileLocation: string;
}
export interface LoadConfigurationEvent {
  data: any; // TODO Make Config Interface
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
  onRequestEncryptVideo: EncryptVideoEvent;
  /**
   * 암호화된 비디오를 복호화 결과 객체
   */
  onRequestDecryptVideo: DecryptVideoEvent;
  /**
   * 여러 환경 설정 파일 읽기를 결과 객체
   */
  onRequestLoadConfiguration: LoadConfigurationEvent;
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
