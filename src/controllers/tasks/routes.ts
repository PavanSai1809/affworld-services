import * as express from 'express';
import controller from './controller';
import validateToken from '../../shared/security/verify-token';

const router = express.Router();
const { getTasks, createTask, updateTaskStatus, deleteTask } = controller;

router.get('/getTasks', validateToken, getTasks);
router.post('/createTask', validateToken, createTask);
router.put('/updateTaskStatus/:id',validateToken, updateTaskStatus);
router.delete('/deleteTask/:id', validateToken, deleteTask);

export default router;