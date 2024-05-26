import { NextFunction, Request, Response } from 'express';
import { config } from '../config/config.ts';
import { redisClient } from '../redisClient.ts';
import { generateQueryString } from '../utils/generateQueryString.ts';

export const queryCacheHandler = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (req.path === `${config.baseUrl}/movies` && req.method === 'GET') {
      const search = req.query.search ? req.query.search.toString() : '';
      const page = req.query.page ? +req.query.page : 1;

      const queryString = generateQueryString(search, page);
      const queryStringInCache = await redisClient.get(queryString);

      if (queryStringInCache) {
        req.url = `${config.baseUrl}/movies/internal?${queryString}`;
      } else {
        const cacheTimeInSeconds = config.cacheMinute * 60;
        const currentDate = new Date();
        const expiredAt = new Date(currentDate.getTime() + config.cacheMinute * 60000).toISOString();

        const cached = await redisClient.set(queryString, expiredAt, { EX: cacheTimeInSeconds });

        if (cached) {
          console.log(
            `Cached ${queryString} query in Redis for ${cacheTimeInSeconds} seconds (Expires at ${expiredAt})`,
          );
        } else {
          console.error(`Unabled to cache ${queryString} query in Redis (${new Date().toISOString})`);
        }

        req.url = `${config.baseUrl}/movies/external?${queryString}`;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
