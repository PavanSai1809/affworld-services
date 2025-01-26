import { Request, Response } from 'express';
import { convertKeysToCamelCase } from './textcase-helper';
type response = object | string | object[];

const success = (req: Request, res: Response, result: response) => {
  if (typeof result === 'string') {
    res.status(200).send({ success: true, result });
  } else {
    res.status(200).send({ success: true, result });
  }
};

const error = (req: Request, res: Response, data: response) => {
  if (typeof data === 'string') {
    res.status(500).send({ success: false, data });
  } else {
    const result = convertKeysToCamelCase(data);
    res.status(500).send({ success: false, result });
  }
};
const errorResponse = (req: Request, res: Response, error: response) => {
  res.status(406).send({ success: false, error });
};

export { success, error, errorResponse };
