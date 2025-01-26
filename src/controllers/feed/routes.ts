import * as express from 'express';
import controller from './controller';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import validateToken from '../../shared/security/verify-token';

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req: express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      return cb(null, false);
    }
    cb(null, true);
  },
});

const router = express.Router();
const { createPost, getPosts, getAllPosts } = controller;

router.get('/getPosts', validateToken, getPosts);
router.post('/createPost', upload.single('file'), validateToken, createPost);
router.get('/allPosts', validateToken, getAllPosts);

export default router;