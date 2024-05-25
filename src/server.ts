import express, { Express, Request, Response } from 'express';
import { config } from './config/config.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import { moviesRouter } from './routes/movies.router.ts';

const app: Express = express();
const port: number = config.port;

app.use(express.json());

app.get(config.baseUrl, (_req: Request, res: Response) => {
  res.send('Welcome to the moviebase api!');
});

app.use(`${config.baseUrl}/movies`, moviesRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
