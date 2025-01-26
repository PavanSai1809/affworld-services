import * as express from 'express';
import controller from './controller';
import validateToken from '../../shared/security/verify-token';

const router = express.Router();
const {
  getUserDetail,
  register,
  login,
  forgotPassword,
  resetPassword,
  getUserDetails,
} = controller;

router.get('/user-detail', validateToken, getUserDetail);
router.get('/validate-email', getUserDetails);
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

export default router;
