import { config } from '../config/config.ts';

export const generatePosterUrl = (posterPath: string): string => {
  return config.apiPosterBaseUrl + posterPath;
};
