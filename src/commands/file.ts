import { fs } from '@tauri-apps/api';

export const saveFile = async (
  path: string,
  data: number[] | string,
  isBinary = true
) => {
  if (isBinary) {
    await fs.writeBinaryFile({
      path,
      contents: data as number[]
    });
  } else {
    await fs.writeTextFile({
      path,
      contents: data as string
    });
  }
};

export const readFile = async (path: string) => {
  return await fs.readBinaryFile(path);
};
