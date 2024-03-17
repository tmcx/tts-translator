import { unlink, writeFile } from 'fs/promises';
import path from 'path';

export class FileManagerService {
  static get(filePath: string) {
    return path.resolve(filePath);
  }

  static async delete(filePath: string) {
    return unlink(filePath);
  }

  static async create(path: string, content: string) {
    await writeFile(path, content);
  }
}
