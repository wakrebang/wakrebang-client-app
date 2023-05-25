import { RawCryptoOption } from '@wak/crypto';

export interface IPCChannelBody {
  requestTimestamp: Date;
}

export interface DownloadVideoBody {
  youtubeUrl: string;
}
export interface EncryptBufferBody {
  buffer: Buffer;
  cryptoOptions: RawCryptoOption[];
}
export interface DecryptBufferBody {
  buffer: Buffer;
  cryptoOptions: RawCryptoOption[];
}

export interface RemoveFileBody {
  fileLocation: string;
}

export interface WriteFileBody {
  fileLocation: string;
  buffer: Buffer;
}

export interface ReadFileBody {
  fileLocation: string;
}

export type LoadConfigurationBody = undefined;

export interface IPCChannelWithoutBody {
  /**
   * 여러 환경 설정 파일 읽기를 요청합니다.
   */
  onRequestLoadConfiguration: undefined;

  onRequestDoNotUse: undefined;
}

export interface IPCChannelWithBody {
  /**
   * Youtube 비디오를 다운로드 요청합니다.
   */
  onRequestDownloadVideo: DownloadVideoBody;
  /**
   * 다운로드된 비디오를 암호화 요청합니다.
   */
  onRequestEncryptBuffer: EncryptBufferBody;
  /**
   * 암호화된 비디오를 복호화 요청합니다.
   */
  onRequestDecryptBuffer: DecryptBufferBody;

  onRequestRemoveFile: RemoveFileBody;

  onRequestWriteFile: WriteFileBody;

  onRequestReadFile: ReadFileBody;
}

export type IPCChannelBodyMap = IPCChannelWithoutBody & IPCChannelWithBody;
