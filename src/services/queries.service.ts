import { Query } from '@prisma/client';
import { CustomError } from '../errors/customErrorClass.ts';
import { prisma } from '../prismaClient.ts';
import { ExternalMoviesResponse } from '../types/movies.types.ts';
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

export const queriesService = {
  createQuery,
};
