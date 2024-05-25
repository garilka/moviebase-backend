import { Movie, Prisma } from '@prisma/client';
import lodash from 'lodash';
import { config } from '../config/config.ts';
import { CustomError } from '../errors/customErrorClass.ts';
import { prisma } from '../prismaClient.ts';
import { ExternalMoviesResponse } from '../types/movies.types';
import { generateMoviesData } from '../utils/generateMoviesData.ts';

const { isEmpty, isEqual } = lodash;

type FetchExternalMoviesProps = {
  search: string;
  page?: number;
};

const fetchExternalMovies = async ({ search, page = 1 }: FetchExternalMoviesProps): Promise<ExternalMoviesResponse> => {
  const url = `${config.apiMovieBaseUrl}?api_key=${process.env.API_KEY_AUTH}AA&query=${search}&page=${page}`;

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

const createMovies = async (newMovies: Prisma.MovieCreateInput[]): Promise<{ count: number }> => {
  try {
    return prisma.movie.createMany({
      data: newMovies,
    });
  } catch (error) {
    throw new CustomError('Error occured during create movies', error);
  }
};

const updateMovie = async (existingMovie: Prisma.MovieUpdateInput): Promise<Movie> => {
  try {
    if (!existingMovie?.id) {
      throw new Error('Movie not exists in database with given id');
    }

    return prisma.movie.update({
      where: {
        id: +existingMovie.id,
      },
      data: existingMovie,
    });
  } catch (error) {
    throw new CustomError('Error occured during update movie', error);
  }
};

const updateMovies = async (moviesToUpdate: Prisma.MovieUpdateInput[]): Promise<Movie[]> => {
  try {
    return Promise.all(moviesToUpdate.map((movie) => updateMovie(movie)));
  } catch (error) {
    throw new CustomError('Error occured during update movies', error);
  }
};

const findMoviesByQuery = async (query: string, onlyCached: boolean): Promise<Movie[]> => {
  try {
    return prisma.movie.findMany({
      where: {
        queries: {
          some: {
            query: {
              query,
              ...(onlyCached && {
                expiredAt: {
                  gt: new Date(),
                },
              }),
            },
          },
        },
      },
    });
  } catch (error) {
    throw new CustomError('Error occured during find movies by query', error);
  }
};

const putMovies = async (externalMovies: ExternalMoviesResponse, query: string): Promise<number[]> => {
  try {
    const moviesFromApi = generateMoviesData(externalMovies);
    const moviesFromDb = await findMoviesByQuery(query, false);

    const moviesFromDbIds = moviesFromDb.map((movie) => movie.id);
    const moviesFromApiIds = moviesFromApi.map((movie) => movie.id);

    const { newMovies, existingMovies } = moviesFromApi.reduce(
      (acc, movie) => {
        if (moviesFromDbIds.includes(movie.id)) {
          acc.existingMovies.push(movie);
        } else {
          acc.newMovies.push(movie);
        }
        return acc;
      },
      {
        newMovies: [] as Prisma.MovieCreateInput[],
        existingMovies: [] as Prisma.MovieUpdateInput[],
      },
    );

    if (!isEmpty(newMovies)) {
      await createMovies(newMovies);
    }

    if (!isEmpty(existingMovies)) {
      const modifiedMovies = filterModifiedMovies(existingMovies, moviesFromDb);

      if (!isEmpty(modifiedMovies)) {
        await updateMovies(modifiedMovies);
      }
    }

    return moviesFromApiIds;
  } catch (error) {
    throw new CustomError('Error occured during put movies', error);
  }
};

const connectMoviesToQuery = async (moviedIds: number[], queryId: string) => {
  try {
    const connections = moviedIds.map((movieId) => ({ movieId, queryId }));

    await prisma.queriesOnMovies.createMany({
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
  findMoviesByQuery,
  putMovies,
  connectMoviesToQuery,
};
