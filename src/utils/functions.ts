import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

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
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const result = errors.array().reduce((prev: any, curr: any) => {
      const key = curr['path'];
      if (key in prev && !prev[key].includes(curr.msg)) {
        prev[key].push(curr.msg);
      } else {
        prev[key] = [curr.msg];
      }
      return prev;
    }, {});
    return res.status(400).json(result);
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
