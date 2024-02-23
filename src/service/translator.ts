import { CommandService } from './command';
import { ConfigService } from './config';

export class TranslatorService {
  private static url = `http://localhost:${ConfigService.getEnv(
    'LT_PORT'
  )}/translate`;

  static async translate(text: string, source: string, target: string) {
    const response = await fetch(TranslatorService.url, {
      method: 'POST',
      body: JSON.stringify({ q: text, source, target }),
      headers: { 'Content-Type': 'application/json' },
    });
    const { translatedText } = await response.json();
    return translatedText;
  }

  static async start() {
    CommandService.exec('/app/venv/bin/libretranslate');
    return new Promise<boolean>((resolve) => {
      const interval = setInterval(async () => {
        TranslatorService.translate('test', 'en', 'en')
          .then(() => {
            resolve(true);
            clearInterval(interval);
          })
          .catch(() => {});
      }, 1000);
    });
  }
}
