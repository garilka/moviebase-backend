import { NextFunction, Request, Response, Router } from 'express';
import { moviesController } from '../controllers/movies.controller.ts';

const moviesRouter = Router();

moviesRouter.get('/', (_req: Request, res: Response) => {
  res.send('Movies api');
});

moviesRouter.get('/internal', (req: Request, res: Response) => {
  res.send('List of movies from internal');
});

moviesRouter.get('/external', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search ? req.query.search.toString() : '';
    const page = req.query.number ? +req.query.number : 1;

    const movies = await moviesController.getExternalMovies({ search, page });

    res.status(200).send(movies);
  } catch (error) {
    next(error);
  }
});

export { moviesRouter };
