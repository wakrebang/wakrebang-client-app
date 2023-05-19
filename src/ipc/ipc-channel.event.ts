export interface IPCChannelEvent {
  eventTimestamp: Date;
  args: any[];
  error: IPCChannelEventError;
}

export interface DownloadVideoEvent extends IPCChannelEvent {
  fileLocation: string;
}
export interface EncryptVideoEvent extends IPCChannelEvent {
  encryptedFileLocation: string;
}
export interface DecryptVideoEvent extends IPCChannelEvent {
  decryptedFileLocation: string;
}
export interface LoadConfigurationEvent extends IPCChannelEvent {
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
  channelType: keyof IPCChannelEvent;
  description: string;
  event: IPCChannelEvent;

  constructor(
    event: IPCChannelEventError['event'],
    channelType: IPCChannelEventError['channelType'],
    description: IPCChannelEventError['description']
  ) {
    super();
    this.channelType = channelType;
    this.description = description;
    this.event = event;
  }

  get message(): string {
    return this.toString();
  }

  toString(): string {
    return `[IPCChannelError:${this.channelType}] Fail Channel Job from "${
      this.description
    }"\ninfo: ${JSON.stringify(this.event, null, 2)}`;
  }

  public static of(
    ...args: ConstructorParameters<typeof IPCChannelEventError>
  ): IPCChannelEventError {
    return new this(...args);
  }
}
