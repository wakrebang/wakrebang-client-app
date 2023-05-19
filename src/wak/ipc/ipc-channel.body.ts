import { CryptoOption } from '@wak/crypto';

export interface IPCChannelBody {
  requestTimestamp: Date;
}

export interface DownloadVideoBody {
  youtubeUrl: string;
}
export interface EncryptVideoBody {
  rawFileLocation: string;
  cryptoOptions: CryptoOption[];
}
export interface DecryptVideoBody {
  encryptedFileLocation: string;
  cryptoOptions: CryptoOption[];
}
export type LoadConfigurationBody = undefined;

export interface IPCChannelWithoutBody {
  /**
   * 여러 환경 설정 파일 읽기를 요청합니다.
   */
  onRequestLoadConfiguration: undefined;
}

export interface IPCChannelWithBody {
  /**
   * Youtube 비디오를 다운로드 요청합니다.
   */
  onRequestDownloadVideo: DownloadVideoBody;
  /**
   * 다운로드된 비디오를 암호화 요청합니다.
   */
  onRequestEncryptVideo: EncryptVideoBody;
  /**
   * 암호화된 비디오를 복호화 요청합니다.
   */
  onRequestDecryptVideo: DecryptVideoBody;
}

export type IPCChannelBodyMap = IPCChannelWithoutBody & IPCChannelWithBody;
