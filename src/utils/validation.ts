import { checkSchema } from 'express-validator';
import { ConfigService } from '../service/config';
import { checkValidation } from './functions';

const languages = ConfigService.getArrayEnv('LT_LOAD_ONLY');
const REQUIRED = {
  LANGUAGE: {
    isString: true,
    notEmpty: true,
    isIn: {
      options: [languages],
    },
    errorMessage: `Valid values: ${languages.join(', ')}.`,
  },
  STRING: {
    isString: true,
    notEmpty: true,
  },
};
const OPTIONAL = {
  NEGATIVE_INT: {
    isInt: {
      options: {
        max: 0,
      },
    },
    optional: true,
  },
  OBJECT: {
    optional: true,
    isObject: true,
  },
  STRING: {
    isString: true,
    notEmpty: true,
    optional: true,
  },
};

const TRANSLATOR = () => ({
  POST: checkSchema({
    from: REQUIRED.LANGUAGE,
    to: REQUIRED.LANGUAGE,
    text: REQUIRED.STRING,
  }),
});

const TTS = () => ({
  POST: checkSchema({
    filename: OPTIONAL.STRING,
    text: REQUIRED.STRING,
    voice: OPTIONAL.OBJECT,
    'voice.name': {
      optional: true,
      isString: true,
      notEmpty: true,
      isIn: {
        options: [ConfigService.getArrayEnv('TTS_VOICES')],
      },
      errorMessage: `Valid values: ${ConfigService.getArrayEnv('TTS_VOICES').join(
        ', '
      )}.`,
    },
    'voice.rate': OPTIONAL.NEGATIVE_INT,
    'voice.volume': OPTIONAL.NEGATIVE_INT,
    'voice.pitch': OPTIONAL.NEGATIVE_INT,
    translate: OPTIONAL.OBJECT,
    'translate.from': REQUIRED.LANGUAGE,
    'translate.to': REQUIRED.LANGUAGE,
  }),
});

export function TTSPostValidation() {
  return [TTS().POST, checkValidation];
}

export function TranslatorPostValidation() {
  return [TRANSLATOR().POST, checkValidation];
}
