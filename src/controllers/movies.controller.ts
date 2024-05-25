import { CustomError } from '../errors/customErrorClass.ts';
import { moviesService } from '../services/movies.service.ts';
import { queriesService } from '../services/queries.service.ts';
import { generateQueryString } from '../utils/generateQueryString.ts';

type GetExternalMoviesProps = {
  search: string;
  page?: number;
};

const getExternalMovies = async ({ search, page }: GetExternalMoviesProps) => {
  const query = generateQueryString(search, page);

  try {
    const externalApiResponse = await moviesService.fetchExternalMovies({ search, page });

    const createdQuery = await queriesService.createQuery({ search, externalApiResponse });

    const createdOrUpdatedMovieIds = await moviesService.putMovies(externalApiResponse, query);

    await moviesService.connectMoviesToQuery(createdOrUpdatedMovieIds, createdQuery.id);

    const moviesForCachedQuery = await moviesService.findMoviesByQuery(query, true);

    return moviesForCachedQuery;
  } catch (error) {
    throw new CustomError('Error occured during get movies from external API', error);
  }
};

export const moviesController = {
  getExternalMovies,
};
