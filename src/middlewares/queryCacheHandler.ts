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
      const cachedExpiredAt = await redisClient.get(queryString);
      const cachedExpiredAtDate = cachedExpiredAt && new Date(cachedExpiredAt);
      const currentDate = new Date();

      if (cachedExpiredAtDate && cachedExpiredAtDate > currentDate) {
        req.url = `${config.baseUrl}/movies/internal?${queryString}`;
      } else {
        req.url = `${config.baseUrl}/movies/external?${queryString}`;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
