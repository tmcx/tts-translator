import { TTSService } from './tts';

export class ConfigService {
  static API_PORT = Number(process.env.API_PORT ?? 8080);

  static async start() {
    const voices = await TTSService.voices();
    ConfigService.setEnv(
      'TTS_VOICES',
      voices.map(({ name }) => name).join(',')
    );
  }

  static getEnv(name: string) {
    return process.env[name] ?? '';
  }

  static getArrayEnv(name: string) {
    return (process.env[name] ?? '').split(',');
  }

  static setEnv(name: string, value: string) {
    process.env[name] = value;
  }
}
