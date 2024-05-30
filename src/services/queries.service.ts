import { Query } from '@prisma/client';
import { config } from '../config/config.ts';
import { CustomError } from '../errors/customErrorClass.ts';
import { prisma } from '../prismaClient.ts';
import { redisClient } from '../redisClient.ts';
import { ExternalMoviesResponse } from '../types/movie.types.ts';
import { SearchMeta } from '../types/query.types.ts';
import { generateQueryData } from '../utils/generateQueryData.ts';
import { generateQueryString } from '../utils/generateQueryString.ts';

type CreateQueryInputs = {
  search: string;
  externalApiResponse: ExternalMoviesResponse;
};

const createQuery = async ({ search, externalApiResponse }: CreateQueryInputs): Promise<Query> => {
  try {
    const queryData = await generateQueryData(search, externalApiResponse);

    return prisma.query.create({
      data: queryData,
    });
  } catch (error) {
    throw new CustomError('Error occured during create query', error);
  }
};

const findFirsQueryBySearch = async (searchQuery: string, onlyCached: boolean): Promise<Query | null> => {
  try {
    return prisma.query.findFirst({
      where: {
        query: searchQuery,
        ...(onlyCached && {
          expiredAt: {
            gt: new Date(),
          },
        }),
      },
    });
  } catch (error) {
    throw new CustomError('Error occured during find first query by search', error);
  }
};

const findSearchMetaByQueryId = async (queryId: string): Promise<SearchMeta> => {
  try {
    return prisma.query.findUniqueOrThrow({
      where: {
        id: queryId,
      },
      select: {
        pageCount: true,
        resultCount: true,
      },
    });
  } catch (error) {
    throw new CustomError('Error occured during find page count by query id', error);
  }
};

const increaseCachedQueryHitCount = async (searchQuery: string): Promise<Query> => {
  const queryInCache = await findFirsQueryBySearch(searchQuery, true);

  if (!queryInCache) {
    throw new Error('No unexpired query found with given searchQuery');
  }

  try {
    return prisma.query.update({
      where: {
        id: queryInCache.id,
      },
      data: {
        hitCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    throw new CustomError('Error occured during increase query hit count', error);
  }
};

const cacheQuery = async (search: string, expiredAt: Date, page?: number) => {
  const queryString = generateQueryString(search, page);
  const cacheTimeInSeconds = config.cacheMinute * 60;
  const expiredAtString = expiredAt.toISOString();

  const cached = await redisClient.set(queryString, expiredAtString, { EX: cacheTimeInSeconds });

  if (cached) {
    console.log(`Cached ${queryString} query in Redis for ${cacheTimeInSeconds} seconds (Expires at ${expiredAt})`);
  } else {
    console.error(`Unabled to cache ${queryString} query in Redis (${new Date().toISOString})`);
  }
};

export const queriesService = {
  createQuery,
  findFirsQueryBySearch,
  findSearchMetaByQueryId,
  increaseCachedQueryHitCount,
  cacheQuery,
};
