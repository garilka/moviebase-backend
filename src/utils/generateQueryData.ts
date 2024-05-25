import { config } from '../config/config.ts';
import { ExternalMoviesResponse } from '../types/movies.types.ts';

export const generateQueryData = (search: string, externalMoviesResponse: ExternalMoviesResponse) => {
  const { page, total_pages, total_results } = externalMoviesResponse;
  const cacheMinutes = config.cacheMinute;
  const currentDate = new Date();

  return {
    search,
    page,
    pageCount: total_pages,
    resultCount: total_results,
    query: `search=${search}&page=${page}`,
    expiredAt: new Date(currentDate.getTime() + cacheMinutes * 60000), // get from Redis later
  };
};
