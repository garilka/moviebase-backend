import { Decimal } from '@prisma/client/runtime/library';
import { ExternalSearchMeta, SearchMeta } from './query.types';

export type ExternalMovie = {
  id: string;
  title: string;
  original_title?: string;
  overview?: string;
  poster_path?: string;
  release_date: string;
  genre_ids: number[];
  vote_average?: number;
  [key: string]: any;
};

export type ExternalMoviesResponse = ExternalSearchMeta & { results: ExternalMovie[] };

export type InternalMovie = {
  id: number;
  title: string;
  releaseDate?: Date | null;
  overview?: string | null;
  voteAverage?: Decimal | null;
  originalTitle?: string | null;
  posterUrl?: string | null;
};

export type InteralMoviesResponse = { meta: SearchMeta } & { movies: InternalMovie[] };
