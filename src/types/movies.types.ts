export type ExternalMeta = {
  page: number;
  total_pages: number;
  total_results: number;
};

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

export type ExternalMoviesResponse = ExternalMeta & { results: ExternalMovie[] };