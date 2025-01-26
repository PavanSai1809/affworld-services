 
import { Request, Response, NextFunction } from 'express';
import { error, success } from '../../shared/response-map';
import Knex from '../../shared/knex';
import { Tables } from '../../shared/knex/knex';
import { hashPassword, passwordCheck } from '../../shared/security/bcrypt';
import { ValidationMessages } from '../../shared/constant-helper';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtSecret } from '../../../config/config.json';
import { sendEmail } from '../../shared/sendEmail';

const { users } = Tables;
const {
  USER_EXIST,
  USER_REGISTERED,
  SOMETHING_ERROR_OCCURRED,
  INVALID_EMAIL,
  PASSWORD_UPDATED,
  NOT_AUTHORIZED,
} = ValidationMessages;

const { secretKey } = jwtSecret;

class user {
  async getUserDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
  
      if (!token) {
        return error(req, res, NOT_AUTHORIZED);
      }
  
      const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
      const userId = decodedToken.userId;
  
      const userDetail = await Knex.generateKnexQuery({
        table: users,
        where: { id: userId },
      });
  
      success(req, res, userDetail);
    } catch (err) {
      next(err);
    }
  }

  async getUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
  
      const { email } = req.query;
      const userDetail = await Knex.generateKnexQuery({
        table: users,
        where: { email },
      });
  
      success(req, res, userDetail);
    } catch (err) {
      next(err);
    }
  }


  async register(req: Request, res: Response, next: NextFunction) {
    const { email, password, name, google_id } = req.body;
  
    try {
      const existingUser = await Knex.generateKnexQuery({
        table: users,
        column: ['email'],
        where: { email },
        limit: 1,
      });
  
      if (existingUser.length > 0) {
        return error(req, res, USER_EXIST);
      }
  
      const user = await Knex.generateKnexQuery({
        table: users,
        insert: {
          email,
          password: google_id ? null : hashPassword(password),
          username: name,
          google_id,
        },
      });
      const getUser = await Knex.generateKnexQuery({
        table: users,
        where: { id: user[0] },
      });
      const token = jwt.sign({ email: getUser[0].email, userId: getUser[0].id }, secretKey);

      success(req, res, google_id ? token : USER_REGISTERED);
    } catch (err) {
      error(req, res, SOMETHING_ERROR_OCCURRED);
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password, google_id } = req.body;

    try {
      const user = await Knex.generateKnexQuery({
        table: users,
        where: { email },
        limit: 1,
      });

      if (!user.length) {
        return error(req, res, INVALID_EMAIL);
      }

      if (google_id) {
        if (user[0].googleId !== google_id) {
          return error(req, res, INVALID_EMAIL);
        }
      } else {
        const isMatch = passwordCheck(password, user[0].password);
        if (!isMatch) {
          return error(req, res, INVALID_EMAIL);
        }
      }

      const token = jwt.sign({ email: user[0].email, userId: user[0].id }, secretKey);

      success(req, res, token);
    } catch (err) {
      error(req, res, SOMETHING_ERROR_OCCURRED);
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email, origin } = req.body;

    try {
      const user = await Knex.generateKnexQuery({
        table: users,
        where: { email },
        limit: 1,
      });

      if (!user) {
        return error(req, res, INVALID_EMAIL);
      }

      const resetToken = jwt.sign({ email: user[0].email }, secretKey, { expiresIn: '1h' });

      await sendEmail({ email, origin, resetToken });

      success(req, res, 'Reset link sent to email');
    } catch (err) {
      error(req, res, SOMETHING_ERROR_OCCURRED);
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { token, newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, secretKey) as JwtPayload;
      const { email } = decoded;

      const user = await Knex.generateKnexQuery({
        table: users,
        where: { email },
        limit: 1,
      });

      if (!user) {
        return error(req, res, INVALID_EMAIL);
      }

      await Knex.generateKnexQuery({
        table: users,
        update: {
          password: hashPassword(newPassword),
        },
        where: { email },
      });

      success(req, res, PASSWORD_UPDATED);
    } catch (err) {
      error(req, res, SOMETHING_ERROR_OCCURRED);
      next(err);
    }
  }
}

const instance = new user();

export default instance;
