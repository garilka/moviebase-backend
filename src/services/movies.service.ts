import { Movie, Prisma } from '@prisma/client';
import lodash from 'lodash';
import { config } from '../config/config.ts';
import { CustomError } from '../errors/customErrorClass.ts';
import { prisma } from '../prismaClient.ts';
import { ExternalMoviesResponse, InternalMovie } from '../types/movie.types.ts';
import { QueryParams } from '../types/query.types.ts';
import { generateMoviesData } from '../utils/generateMoviesData.ts';

const { isEmpty, isEqual } = lodash;

const fetchExternalMovies = async ({ search, page = 1 }: QueryParams): Promise<ExternalMoviesResponse> => {
  const url = `${config.apiMovieBaseUrl}?api_key=${process.env.API_KEY_AUTH}&query=${search}&page=${page}`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.status !== 200) {
      throw new CustomError('Unsuccessful external API request', data);
    }

    return data;
  } catch (error) {
    throw new CustomError('Error occured during fetch movies from external resource', error);
  }
};

const createMovies = async (
  newMovies: Prisma.MovieCreateInput[],
  tx: Prisma.TransactionClient,
): Promise<{ count: number }> => {
  try {
    return tx.movie.createMany({
      data: newMovies,
    });
  } catch (error) {
    throw new CustomError('Error occured during create movies', error);
  }
};

const updateMovie = async (existingMovie: Prisma.MovieUpdateInput, tx: Prisma.TransactionClient): Promise<Movie> => {
  try {
    if (!existingMovie?.id) {
      throw new Error('Movie not exists in database with given id');
    }

    return tx.movie.update({
      where: {
        id: +existingMovie.id,
      },
      data: existingMovie,
    });
  } catch (error) {
    throw new CustomError('Error occured during update movie', error);
  }
};

const updateMovies = async (
  moviesToUpdate: Prisma.MovieUpdateInput[],
  tx: Prisma.TransactionClient,
): Promise<Movie[]> => {
  try {
    return Promise.all(moviesToUpdate.map((movie) => updateMovie(movie, tx)));
  } catch (error) {
    throw new CustomError('Error occured during update movies', error);
  }
};

const findMoviesByQueryId = async (queryId: string): Promise<InternalMovie[]> => {
  try {
    return prisma.movie.findMany({
      where: {
        queries: {
          some: {
            query: {
              id: queryId,
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        releaseDate: true,
        overview: true,
        voteAverage: true,
        originalTitle: true,
        posterUrl: true,
      },
    });
  } catch (error) {
    throw new CustomError('Error occured during find movies by query id', error);
  }
};

const findMoviesByIds = async (movieIds: number[]): Promise<Movie[]> => {
  try {
    return prisma.movie.findMany({
      where: {
        id: {
          in: movieIds,
        },
      },
    });
  } catch (error) {
    throw new CustomError('Error occured during find movies by ids', error);
  }
};

const putMovies = async (
  externalMovies: ExternalMoviesResponse,
  query: string,
  tx: Prisma.TransactionClient,
): Promise<number[]> => {
  try {
    const moviesFromApi = generateMoviesData(externalMovies);
    const moviesFromApiIds = moviesFromApi.map((movieFromApi) => movieFromApi.id);

    const existingMovies = await findMoviesByIds(moviesFromApiIds);
    const existingMovieIds = existingMovies.map((existingMovie) => existingMovie.id);

    const newMovies = moviesFromApi.filter((movieFromApi) => !existingMovieIds.includes(movieFromApi.id));

    if (!isEmpty(newMovies)) {
      await createMovies(newMovies, tx);
    }

    if (!isEmpty(existingMovies)) {
      const modifiedMovies = filterModifiedMovies(moviesFromApi, existingMovies);

      if (!isEmpty(modifiedMovies)) {
        await updateMovies(modifiedMovies, tx);
      }
    }

    return moviesFromApiIds;
  } catch (error) {
    throw new CustomError('Error occured during put movies', error);
  }
};

const connectMoviesToQuery = async (moviedIds: number[], queryId: string, tx: Prisma.TransactionClient) => {
  try {
    const connections = moviedIds.map((movieId) => ({ movieId, queryId }));

    await tx.queriesOnMovies.createMany({
      data: connections,
    });
  } catch (error) {
    throw new CustomError('Error occured during connect movies to query', error);
  }
};

const filterModifiedMovies = (moviesFromApi: Prisma.MovieUpdateInput[], moviesFromDb: Movie[]) => {
  return moviesFromApi.filter((movieFromApi) => {
    const movieFromDb = moviesFromDb.find((movieFromDb) => movieFromDb.id === movieFromApi.id);

    const movieFromApiToCompare = {
      voteAverage: movieFromApi?.voteAverage?.toString(),
      posterUrl: movieFromApi?.posterUrl ?? null,
    };
    const movieFromDbToCompare = {
      voteAverage: movieFromDb?.voteAverage?.toString(),
      posterUrl: movieFromDb?.posterUrl ?? null,
    };

    return !isEqual(movieFromApiToCompare, movieFromDbToCompare);
  });
};

export const moviesService = {
  fetchExternalMovies,
  findMoviesByQueryId,
  findMoviesByIds,
  putMovies,
  connectMoviesToQuery,
};
