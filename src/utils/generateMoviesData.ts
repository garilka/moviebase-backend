import { Prisma } from '@prisma/client';
import { ExternalMoviesResponse } from '../types/movies.types.ts';
import { generatePosterUrl } from './generatePosterUrl.ts';

export const generateMoviesData = (externalMoviesResponse: ExternalMoviesResponse): Prisma.MovieCreateInput[] => {
  const internalMovies: Prisma.MovieCreateInput[] = externalMoviesResponse?.results?.map((externalMovie) => {
    const { id, title, genre_ids, release_date, overview, vote_average, original_title, poster_path } = externalMovie;
    const date = new Date().toISOString();
    // NEED FIX
    // sometimes the 3rd parti API return release_date that has invalid form, can' be converted to ISO string

    return {
      id: +id,
      title,
      genreIds: genre_ids,
      releaseDate: date,
      rawData: JSON.stringify(externalMovie),
      ...(overview && { overview }),
      ...(vote_average && { voteAverage: vote_average }),
      ...(original_title && { originalTitle: original_title }),
      ...(poster_path && { posterUrl: generatePosterUrl(poster_path) }),
    };
  });

  return internalMovies;
};
