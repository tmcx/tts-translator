import { HTTPApi } from './service/http-api';
import { TranslatorService } from './service/translator';

(async () => {
  console.log('Starting...');
  await TranslatorService.start();
  HTTPApi.start();
})();
