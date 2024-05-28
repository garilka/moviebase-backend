import { CustomError } from '../errors/customErrorClass.ts';
import { moviesService } from '../services/movies.service.ts';
import { queriesService } from '../services/queries.service.ts';
import { InteralMoviesResponse } from '../types/movie.types.ts';
import { QueryParams } from '../types/query.types.ts';
import { generateQueryString } from '../utils/generateQueryString.ts';

const getInternalMovies = async ({ search, page }: QueryParams): Promise<InteralMoviesResponse> => {
  try {
    const queryString = generateQueryString(search, page);

    const query = await queriesService.increaseCachedQueryHitCount(queryString);

    const movies = await moviesService.findMoviesByQueryId(query.id);

    const searchMeta = await queriesService.findSearchMetaByQueryId(query.id);

    return { meta: searchMeta, movies: movies };
  } catch (error) {
    throw new CustomError('Error occured during get movies from internal database', error);
  }
};

const getExternalMovies = async ({ search, page }: QueryParams): Promise<InteralMoviesResponse> => {
  try {
    const query = generateQueryString(search, page);

    const externalApiResponse = await moviesService.fetchExternalMovies({ search, page });

    const createdOrUpdatedMovieIds = await moviesService.putMovies(externalApiResponse, query);

    const createdQuery = await queriesService.createQuery({ search, externalApiResponse });

    await moviesService.connectMoviesToQuery(createdOrUpdatedMovieIds, createdQuery.id);

    const movies = await moviesService.findMoviesByQueryId(createdQuery.id);

    const searchMeta = await queriesService.findSearchMetaByQueryId(createdQuery.id);

    return { meta: searchMeta, movies: movies };
  } catch (error) {
    throw new CustomError('Error occured during get movies from external API', error);
  }
};

export const moviesController = {
  getInternalMovies,
  getExternalMovies,
};
