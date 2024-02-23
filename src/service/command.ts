import { exec } from 'child_process';

export class CommandService {
  static async exec<T>(cmd: string): Promise<T> {
    return new Promise<T>((resolve, reject) =>
      exec(cmd, (error, stdout, _) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout as T);
      })
    );
  }
}
