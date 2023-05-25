import fs from 'fs';

//#region File Read, Write

export function readFileNonBlocking(path: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export function writeFileNonBlocking(
  path: string,
  buffer: Buffer
): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
//#endregion
