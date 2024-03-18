import {
  TranslatePostValidation,
  TTSPostValidation,
} from '../utils/validation';
import express, { NextFunction, Request, Response, Express } from 'express';
import { FileManagerService } from '../service/file-manager';
import { CONTENT_TYPE, HEADER } from '../utils/constant';
import { sanitizeFilename } from '../utils/functions';
import { ConfigService } from '../service/config';
import { TTSService } from '../service/tts';
import uuid from 'short-unique-id';
import { TranslatorService } from './translator';

export class HTTPApi {
  static app: Express;

  static start() {
    this.app = express();
    this.loadMiddlewares();
    this.loadRoutes();
  }

  private static loadRoutes() {
    this.app.post(
      '/tts',
      TTSPostValidation,
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

    this.app.get('/tts/voices', async (_req, res) => {
      res.send(await TTSService.voices());
    });

    this.app.post(
      '/translate',
      TranslatePostValidation,
      async (req: Request, res: Response) => {
        const { from, to, text } = req.body;
        const result = await TranslatorService.translate(text, from, to);
        res.send({ text: result });
      }
    );

    this.app.get(
      '/translate/languages',
      async (_: Request, res: Response) => {
        const languages = ConfigService.getArrayEnv('LT_LOAD_ONLY').map(
          (name) => ({
            name,
          })
        );
        res.send(languages);
      }
    );

    this.app.listen(ConfigService.API_PORT, '0.0.0.0', () => {
      console.log(`Ready. Listening on port ${ConfigService.API_PORT}.`);
    });
  }

  private static loadMiddlewares() {
    this.app.use(express.json());

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      req.headers['pid'] = new uuid().rnd();
      req.headers['date'] = new Date().getSeconds().toString();
      console.log(
        req.headers['pid'],
        'IN ',
        req.method.padEnd(3, ' '),
        req.path
      );
      next();

      res.once('finish', () => {
        const duration =
          Math.round(
            (new Date().getSeconds() - +(req.headers['date'] ?? 0)) * 100
          ) / 100;
        console.log(
          req.headers['pid'],
          'OUT',
          req.method.padEnd(3, ' '),
          req.path,
          duration + 's'
        );
      });
    });
  }
}
