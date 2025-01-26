/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cluster from 'cluster';
import os from 'os';
import { routes } from './src/routes';

const app = express();

Object.assign(global, {
  log: (...args: any[]) => console.log(...args),
  info: (...args: any[]) => console.info(...args),
  error: (...args: any[]) => console.error(...args),
});

const notFound = (req: Request, res: Response) => {
  res.status(404).send({ success: false, message: 'Not Found' });
};

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;
  const clusterCount = cpuCount >= 4 ? 4 : cpuCount;

  for (let i = 0; i < clusterCount; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.info(`Worker ${worker.process.pid} died. Forking a new one..!`);
    cluster.fork();
  });

} else {
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get('/api/v1/health-check', (req: Request, res: Response) => {
    res.send({ success: true, message: 'Rest API Server running...' });
  });

  app.use('/api/v1', routes());
  app.use('/*', notFound);

  app.use((err: Error, req: Request, res: Response) => {
    console.error(req.headers.host, err);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  });

  const PORT = process.env.PORT || 4002;
  app.listen(PORT, () => {
    console.info(`Worker ${process.pid} is listening on port ${PORT}...`);
  });
}
