import { redisClient } from '../redisClient.ts';
import { ExternalMoviesResponse } from '../types/movies.types.ts';
import { generateQueryString } from './generateQueryString.ts';

export const generateQueryData = async (
  search: string,

  externalMoviesResponse: ExternalMoviesResponse,
) => {
  const { page, total_pages, total_results } = externalMoviesResponse;
  const searchQuery = generateQueryString(search, page);
  const expiredAt = await redisClient.get(searchQuery);

  return {
    search,
    page,
    pageCount: total_pages,
    resultCount: total_results,
    query: generateQueryString(search, page),
    expiredAt: expiredAt!,
  };
};
