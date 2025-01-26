import express from 'express';
import controller from './controller';

const router = express.Router();
const { get } = controller;

router.get('/', get);

export default router;
