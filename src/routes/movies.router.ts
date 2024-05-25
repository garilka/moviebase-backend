import { NextFunction, Request, Response, Router } from 'express';
import { moviesController } from '../controllers/movies.controller.ts';

const moviesRouter = Router();

moviesRouter.get('/internal', (req: Request, res: Response) => {
  res.send('List of movies from internal');
});

moviesRouter.get('/external', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movies = await moviesController.getExternalMovies({
      search: 'cat',
      page: 177,
    });

    res.status(200).send(movies);
  } catch (error) {
    next(error);
  }
});

export { moviesRouter };
