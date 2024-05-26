import { Prisma } from '@prisma/client';
import { ExternalMoviesResponse } from '../types/movies.types.ts';
import { convertToValidStringDate } from './convertToValidDate.ts';
import { generatePosterUrl } from './generatePosterUrl.ts';

export const generateMoviesData = (externalMoviesResponse: ExternalMoviesResponse): Prisma.MovieCreateInput[] => {
  const internalMovies: Prisma.MovieCreateInput[] = externalMoviesResponse?.results?.map((externalMovie) => {
    const { id, title, genre_ids, release_date, overview, vote_average, original_title, poster_path } = externalMovie;
    const releaseDate = convertToValidStringDate(release_date);

    return {
      id: +id,
      title,
      genreIds: genre_ids,
      releaseDate,
      rawData: JSON.stringify(externalMovie),
      ...(overview && { overview }),
      ...(vote_average && { voteAverage: vote_average }),
      ...(original_title && { originalTitle: original_title }),
      ...(poster_path && { posterUrl: generatePosterUrl(poster_path) }),
    };
  });

  return internalMovies;
};
