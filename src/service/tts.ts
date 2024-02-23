import { replaceAll } from '../utils/functions';
import { CommandService } from './command';
import { v4 as uuid } from 'uuid';

export class TTSService {
  static async textToSpeech(
    text: string,
    voice?: { name?: string; volume?: number; pitch?: number; rate?: number }
  ) {
    text = replaceAll(text, '"', "'");
    const id = uuid();
    const path = `/tts/${id}.mp3`;
    let cmd = `edge-tts --text "${text}" --write-media ${path}`;
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
