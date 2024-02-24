import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '../service/config';
import { checkValidation } from './functions';
import { TTSService } from '../service/tts';
import * as Joi from 'joi';

const voices = async () => (await TTSService.voices()).map(({ name }) => name);
const languages = () => ConfigService.getArrayEnv('LT_LOAD_ONLY');

const VALIDATION = {
  NEG_INTEGER: Joi.number().integer().less(0).optional(),
  TEXT: Joi.string().required(),
  LANGUAGE: Joi.string()
    .valid(...languages())
    .required(),
};

const TranslateSchema = async () =>
  Joi.object({
    text: VALIDATION.TEXT,
    from: VALIDATION.LANGUAGE,
    to: VALIDATION.LANGUAGE,
  });

const TTSSchema = async () =>
  Joi.object({
    text: VALIDATION.TEXT,
    filename: Joi.string().optional(),
    voice: Joi.object({
      name: Joi.string()
        .optional()
        .valid(...(await voices())),
      volume: VALIDATION.NEG_INTEGER,
      pitch: VALIDATION.NEG_INTEGER,
      rate: VALIDATION.NEG_INTEGER,
    }).optional(),
    translate: Joi.object({
      from: VALIDATION.LANGUAGE,
      to: VALIDATION.LANGUAGE,
    }).optional(),
  });

export async function TTSPostValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return checkValidation(req, res, next, await TTSSchema());
}

export async function TranslatePostValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return checkValidation(req, res, next, await TranslateSchema());
}
