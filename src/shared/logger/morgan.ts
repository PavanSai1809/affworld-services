/* eslint-disable @typescript-eslint/no-explicit-any */
import morgan from 'morgan';
import { Request, Response } from 'express';

const commonLogger = morgan((tokens: any, req: Request, res: Response) => {
  if (['/api/v1/health-check'].includes(req.url)) return null;
  return [
    req.headers.host,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
  ].join(' ');
});

export { commonLogger };
