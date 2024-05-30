import { config } from '../config/config.ts';
import { ExternalMoviesResponse } from '../types/movie.types.ts';
import { generateQueryString } from './generateQueryString.ts';

export const generateQueryData = async (
  search: string,

  externalMoviesResponse: ExternalMoviesResponse,
) => {
  const { page, total_pages, total_results } = externalMoviesResponse;
  const searchQuery = generateQueryString(search, page);
  const currentDate = new Date();
  const expiredAt = new Date(currentDate.getTime() + config.cacheMinute * 60000).toISOString();

  return {
    search,
    page,
    pageCount: total_pages,
    resultCount: total_results,
    query: searchQuery,
    expiredAt: expiredAt,
  };
};
