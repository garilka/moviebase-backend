import { Query } from '@prisma/client';
import { CustomError } from '../errors/customErrorClass.ts';
import { prisma } from '../prismaClient.ts';
import { ExternalMoviesResponse } from '../types/movie.types.ts';
import { generateQueryData } from '../utils/generateQueryData.ts';

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

export const queriesService = {
  createQuery,
  findFirsQueryBySearch,
  increaseCachedQueryHitCount,
};
