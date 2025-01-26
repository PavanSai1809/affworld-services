/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import Knex from '../../shared/knex';
import { success } from '../../shared/response-map';
import { Tables } from '../../shared/knex/knex';
import { ValidationMessages } from '../../shared/constant-helper';

const { tasks } = Tables;
const { TASK_CREATED, TASK_STATUS_UPDATED, TASK_DELETED } = ValidationMessages;

type User = {
  email: string;
  id: number;
};

class TaskController {
  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as Request & { user?: User }).user?.id;

      const getTasks = await Knex.generateKnexQuery({
        table: tasks,
        where: { user_id: userId },
      });
  
      const groupedTasks = getTasks.reduce((acc: any, task: any) => {
        acc[task.status] = acc[task.status] || [];
        acc[task.status].push(task);
        return acc;
      }, { Pending: [], Completed: [], Done: [] });
  
      success(req, res, groupedTasks);
    } catch (err) {
      next(err);
    }
  }

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as Request & { user?: User }).user?.id;
      const { task_name, task_description } = req.body;
  
      await Knex.generateKnexQuery({
        table: tasks,
        insert: {
          task_name,
          task_description,
          user_id: userId,
        },
      });
  
      success(req, res, TASK_CREATED);
    } catch (err) {
      next(err);
    }
  }

  async updateTaskStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as Request & { user?: User }).user?.id;
      const { id } = req.params;
      const { status } = req.body;
  
      await Knex.generateKnexQuery({
        table: tasks,
        where: { id, user_id: userId },
        update: { status },
      });

      success(req, res, TASK_STATUS_UPDATED);
    } catch (err) {
      next(err);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as Request & { user?: User }).user?.id;
      const { id } = req.params;
  
      await Knex.generateKnexQuery({
        table: tasks,
        where: { id, user_id: userId },
        del: true,
      });
  
      success(req, res, TASK_DELETED);
    } catch (err) {
      next(err);
    }
  }
}

const instance = new TaskController();
export default instance;
