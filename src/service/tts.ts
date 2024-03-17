import { replaceAll } from '../utils/functions';
import { CommandService } from './command';
import { v4 as uuid } from 'uuid';
import { FileManagerService } from './file-manager';

export class TTSService {
  static async textToSpeech(
    text: string,
    voice?: { name?: string; volume?: number; pitch?: number; rate?: number }
  ) {
    const id = uuid();
    const textPath = `/tmp/${id}.txt`;
    await FileManagerService.create(textPath, text);
    const path = `/tts/${id}.mp3`;
    let cmd = `edge-tts --file=${textPath} --write-media ${path}`;
    if (voice?.name) {
      cmd += ` --voice ${voice.name}`;
    }
    if (voice?.pitch) {
      cmd += ` --pitch=${voice.pitch}Hz`;
    }
    if (voice?.volume) {
      cmd += ` --volume=${voice.volume}%`;
    }
    if (voice?.rate) {
      cmd += ` --rate=${voice.rate}%`;
    }
    await CommandService.exec(cmd);
    await FileManagerService.delete(textPath);
    return { uuid: id, path };
  }

  static async voices(): Promise<{ name: string; gender: string }[]> {
    const cmd = `edge-tts --list-voices`;
    let response = await CommandService.exec<string>(cmd);
    response = replaceAll(JSON.stringify(response), '\\n', '","');
    response = replaceAll(response, 'Name: ', '{"name":"');
    response = replaceAll(response, ',"Gender: ', ',"gender":"');
    response = replaceAll(response, ',"","', '},');
    response = replaceAll(response, ',""', '}');
    response = replaceAll(response, '"{"', '{"');
    response = `[${response}]`;
    return JSON.parse(response);
  }
}
