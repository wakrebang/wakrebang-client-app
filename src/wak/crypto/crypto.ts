import crypto, { CipherKey } from 'crypto';

export type CryptoOption = {
  algorithm: string;
  key: CipherKey;
};

export type RawCryptoOption = {
  algorithm: string;
  key: string;
};

const createRawCryptoOption = (
  algorithm: string,
  key: string
): RawCryptoOption => ({
  algorithm,
  key
});

const createCryptoOptionFromRaw = (raw: RawCryptoOption): CryptoOption => ({
  algorithm: raw.algorithm,
  key: crypto
    .createHash('sha256')
    .update(String(raw.key))
    .digest('base64')
    .substring(0, 32)
});

const encryptBuffer = (buffer: Buffer, option: CryptoOption): Buffer => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(option.algorithm, option.key, iv);
  return Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
};

const encryptBufferMultipleOptions = (
  buffer: Buffer,
  options: CryptoOption[]
): Buffer => {
  return options.reduce((buf, opt) => encryptBuffer(buf, opt), buffer);
};

const decryptBuffer = (encrypted: Buffer, option: CryptoOption): Buffer => {
  const iv = encrypted.slice(0, 16);
  encrypted = encrypted.slice(16);
  const decipher = crypto.createDecipheriv(option.algorithm, option.key, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
};

const decryptBufferMultipleOptions = (
  buffer: Buffer,
  options: CryptoOption[]
): Buffer => {
  return options.reduce((buf, opt) => decryptBuffer(buf, opt), buffer);
};

export const cryptos = {
  createCryptoOptionFromRaw,
  createRawCryptoOption,
  encryptBuffer,
  encryptBufferMultipleOptions,
  decryptBuffer,
  decryptBufferMultipleOptions
};

export default cryptos;
