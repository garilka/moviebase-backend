import { CustomError } from '../errors/customErrorClass.ts';
import { moviesService } from '../services/movies.service.ts';
import { queriesService } from '../services/queries.service.ts';
import { InternalMovie } from '../types/movies.types.ts';
import { QueryParams } from '../types/query.types.ts';
import { generateQueryString } from '../utils/generateQueryString.ts';

const getInternalMovies = async ({ search, page }: QueryParams): Promise<(InternalMovie | undefined)[]> => {
  try {
    const queryString = generateQueryString(search, page);

    const query = await queriesService.increaseCachedQueryHitCount(queryString);

    const moviesByQueryId = await moviesService.findMoviesByQueryId(query.id);

    return moviesByQueryId;
  } catch (error) {
    throw new CustomError('Error occured during get movies from internal database', error);
  }
};

const getExternalMovies = async ({ search, page }: QueryParams): Promise<(InternalMovie | undefined)[]> => {
  try {
    const query = generateQueryString(search, page);

    const externalApiResponse = await moviesService.fetchExternalMovies({ search, page });

    const createdOrUpdatedMovieIds = await moviesService.putMovies(externalApiResponse, query);

    const createdQuery = await queriesService.createQuery({ search, externalApiResponse });

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
