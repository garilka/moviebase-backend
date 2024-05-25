import express, { Express, Request, Response } from 'express';
import { config } from './config/config.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import { queryCacheHandler } from './middlewares/queryCacheHandler.ts';
import { redisClient } from './redisClient.ts';
import { moviesRouter } from './routes/movies.router.ts';

const app: Express = express();
const port: number = config.port;

(async () => {
  await redisClient.connect();
})();

app.use(express.json());
app.use(queryCacheHandler);

app.get(config.baseUrl, (_req: Request, res: Response) => {
  res.send('Welcome to the moviebase api!');
});

app.use(`${config.baseUrl}/movies`, moviesRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
