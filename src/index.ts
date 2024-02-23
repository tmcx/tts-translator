import {
  TranslatorPostValidation,
  TTSPostValidation,
} from './utils/validation';
import express, { Request, Response } from 'express';
import { FileManagerService } from './service/file-manager';
import { TranslatorService } from './service/translator';
import { CONTENT_TYPE, HEADER } from './utils/constant';
import { ConfigService } from './service/config';
import { TTSService } from './service/tts';
import { sanitizeFilename } from './utils/functions';

(async () => {
  console.log('Starting...');
  await ConfigService.start();
  await TranslatorService.start();
  startAPI();
})();

async function startAPI() {
  const app = express();
  app.use(express.json());

  app.post(
    '/tts',
    ...TTSPostValidation(),
    async (req: Request, res: Response) => {
      let { text, translate, voice, filename } = req.body;
      if (translate) {
        const { from, to } = translate;
        text = await TranslatorService.translate(text, from, to);
        console.log('Text translation: Ready.');
      }

      const { path, uuid } = await TTSService.textToSpeech(text, voice);
      console.log('TTS: Ready.');
      filename = sanitizeFilename(filename ?? uuid);
      res
        .type(CONTENT_TYPE.MP3)
        .setHeader(
          HEADER.CONTENT_DISPOSITION.NAME,
          HEADER.CONTENT_DISPOSITION.VALUE(filename)
        )
        .sendFile(FileManagerService.get(path));
    }
  );

  app.get('/tts/voices', async (_req, res) => {
    res.send(await TTSService.voices());
  });

  app.post(
    '/translate',
    ...TranslatorPostValidation(),
    async (req: Request, res: Response) => {
      const { from, to, text } = req.body;
      const result = await TranslatorService.translate(text, from, to);
      res.send({ text: result });
    }
  );

  app.get('/translate/languages', async (_: Request, res: Response) => {
    const languages = ConfigService.getArrayEnv('LT_LOAD_ONLY').map((name) => ({
      name,
    }));
    res.send(languages);
  });

  app.listen(ConfigService.API_PORT, '0.0.0.0', () => {
    console.log(`Ready. Listening on port ${ConfigService.API_PORT}.`);
  });
}
