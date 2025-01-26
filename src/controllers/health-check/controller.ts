import { Request, Response } from 'express';
import { success } from '../../shared/response-map';
import { ValidationMessages } from '../../shared/constant-helper';

const { HEALTH_CHECK } = ValidationMessages;

class healthCheck {
  async get(req: Request, res: Response): Promise<void> {
    success(req, res, HEALTH_CHECK);
  }
}

const instance = new healthCheck();

export default instance;
