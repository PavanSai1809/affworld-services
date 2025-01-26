import { Request, Response, NextFunction } from 'express';
import Knex from '../../shared/knex';
import { success, errorResponse } from '../../shared/response-map';
import cloudinary from 'cloudinary';
import { Tables } from '../../shared/knex/knex';
import config from '../../../config/config.json';

const { posts } = Tables;

cloudinary.v2.config({
  cloud_name: config.cloudinaryConfig.cloud_name,
  api_key: config.cloudinaryConfig.api_key,
  api_secret: config.cloudinaryConfig.api_secret,
});

type User = {
  email: string;
  id: number;
};

class PostController {
  async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as Request & { user?: User }).user?.id;
      const file = req.file;
      if (!file) {
        return errorResponse(req, res, 'No file uploaded');
      }

      const result = await cloudinary.v2.uploader.upload(file.path);
      const photoUrl = result.secure_url;

      const { caption } = req.body;

      await Knex.generateKnexQuery({
        table: posts,
        insert: {
          user_id: userId,
          photo_url: photoUrl,
          caption,
        },
      });

      success(req, res, 'Post created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as Request & { user?: User }).user?.id;

      const post = await Knex.generateKnexQuery({
        table: posts,
        where: { user_id: userId },
      });

      success(req, res, post);
    } catch (error) {
      next(error);
    }
  }

  async getAllPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as Request & { user?: User }).user?.id;
  
      const allPosts = await Knex.generateKnexQuery({
        table: posts,
        whereNot: { user_id: userId },
      });
  
      if (!allPosts || allPosts.length === 0) {
        return errorResponse(req, res, 'No posts found');
      }
  
      success(req, res, allPosts);
    } catch (error) {
      next(error);
    }
  }
  
}

const postController = new PostController();
export default postController;
