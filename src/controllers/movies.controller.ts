import { CustomError } from '../errors/customErrorClass.ts';
import { moviesService } from '../services/movies.service.ts';
import { queriesService } from '../services/queries.service.ts';
import { generateQueryString } from '../utils/generateQueryString.ts';

type GetInternalMoviesProps = {
  search: string;
  page?: number;
};

type GetExternalMoviesProps = {
  search: string;
  page?: number;
};

const getInternalMovies = async ({ search, page }: GetInternalMoviesProps) => {
  try {
    const queryString = generateQueryString(search, page);

    const query = await queriesService.increaseCachedQueryHitCount(queryString);

    const moviesByQueryId = await moviesService.findMoviesByQueryId(query.id);

    return moviesByQueryId;
  } catch (error) {
    throw new CustomError('Error occured during get movies from internal database', error);
  }
};

const getExternalMovies = async ({ search, page }: GetExternalMoviesProps) => {
  try {
    const query = generateQueryString(search, page);

    const externalApiResponse = await moviesService.fetchExternalMovies({ search, page });

    const createdQuery = await queriesService.createQuery({ search, externalApiResponse });

    const createdOrUpdatedMovieIds = await moviesService.putMovies(externalApiResponse, query);

    await moviesService.connectMoviesToQuery(createdOrUpdatedMovieIds, createdQuery.id);

    const moviesByQueryId = await moviesService.findMoviesByQueryId(createdQuery.id);

    return moviesByQueryId;
  } catch (error) {
    throw new CustomError('Error occured during get movies from external API', error);
  }
};

export const moviesController = {
  getInternalMovies,
  getExternalMovies,
};
