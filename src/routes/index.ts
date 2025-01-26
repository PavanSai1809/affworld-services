import express from 'express';
import healthCheck from '../controllers/health-check/routes';
import user from '../controllers/user/routes';
import task from '../controllers/tasks/routes';
import feed from '../controllers/feed/routes';
// import googleAuth from '../controllers/googleAuth/controller';

const router = express.Router();

export const routes = () => {
  router.use('/health-check', healthCheck);
  router.use('/user', user);
  router.use('/task', task);
  router.use('/feed', feed);
  // router.use('/google-login',googleAuth );
  return router;
};
