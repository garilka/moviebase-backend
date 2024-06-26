import { NextFunction, Request, Response, Router } from 'express';
import { moviesController } from '../controllers/movies.controller.ts';
import { InteralMoviesResponse } from '../types/movie.types.ts';
import { ApiResponse } from '../types/response.type.ts';

const moviesRouter = Router();

moviesRouter.get('/', (_req: Request, res: Response) => {
  res.send('Movies api');
});

moviesRouter.get('/internal', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search ? req.query.search.toString() : '';
    const page = req.query.page ? +req.query.page : 1;

    const moviesWithMeta = await moviesController.getInternalMovies({ search, page });

    const response: ApiResponse<InteralMoviesResponse> = {
      message: 'Movies fetched from internal database',
      data: moviesWithMeta,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

moviesRouter.get('/external', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search ? req.query.search.toString() : '';
    const page = req.query.page ? +req.query.page : 1;

    const moviesWithMeta = await moviesController.getExternalMovies({ search, page });

    const response: ApiResponse<InteralMoviesResponse> = {
      message: 'Movies fetched from 3rd parti API',
      data: moviesWithMeta,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

export { moviesRouter };
