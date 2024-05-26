import { NextFunction, Request, Response, Router } from 'express';
import { moviesController } from '../controllers/movies.controller.ts';

const moviesRouter = Router();

moviesRouter.get('/', (_req: Request, res: Response) => {
  res.send('Movies api');
});

moviesRouter.get('/internal', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search ? req.query.search.toString() : '';
    const page = req.query.page ? +req.query.page : 1;

    const movies = await moviesController.getInternalMovies({ search, page });
    res.status(200).send({ message: 'Movies fetched from internal database', result: movies });
  } catch (error) {
    next(error);
  }
});

moviesRouter.get('/external', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search ? req.query.search.toString() : '';
    const page = req.query.page ? +req.query.page : 1;

    const movies = await moviesController.getExternalMovies({ search, page });

    res.status(200).send({ message: 'Movies fetched from 3rd parti API', result: movies });
  } catch (error) {
    next(error);
  }
});

export { moviesRouter };
