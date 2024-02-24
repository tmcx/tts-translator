import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export function replaceAll(
  inp: string,
  searchValue: string,
  replaceValue: string
) {
  inp = inp.replace(searchValue, replaceValue);
  if (!inp.includes(searchValue)) {
    return inp;
  }
  inp = replaceAll(inp, searchValue, replaceValue);
  return inp;
}

export function checkValidation(
  req: Request,
  res: Response,
  next: NextFunction,
  schema: Joi.ObjectSchema<any>
) {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details.map((err) => err.message));
  }
  next();
}

export function sanitizeFilename(name: string) {
  return name
    .trim()
    .replace(/ +/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}
