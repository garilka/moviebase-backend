export const config = {
  port: process.env.PORT ? +process.env.PORT : 3001,
  baseUrl: process.env.BASE_URL ?? '/api',
  apiMovieBaseUrl: process.env.API_MOVIE_BASE_URL ?? 'https://api.themoviedb.org/3/search/movie',
  apiPosterBaseUrl: process.env.API_MOVIE_BASE_URL ?? 'https://image.tmdb.org/t/p/w500e',
  cacheMinute: process.env.CACHE_TIME_MINUTE ? +process.env.CACHE_TIME_MINUTE : 2,
};
