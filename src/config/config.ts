export const config = {
  baseUrl: process.env.BASE_URL ?? '/api',
  port: process.env.PORT ? +process.env.PORT : 3001,
  redisBaseUrl: process.env.REDIS_BASE_URL ?? 'redis://127.0.0.1:',
  redisPort: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
  apiMovieBaseUrl: process.env.API_MOVIE_BASE_URL ?? 'https://api.themoviedb.org/3/search/movie',
  apiPosterBaseUrl: process.env.API_POSTER_BASE_URL ?? 'https://image.tmdb.org/t/p/w500',
  cacheMinute: process.env.CACHE_TIME_MINUTE ? +process.env.CACHE_TIME_MINUTE : 2,
  corsOptions: {
    origin: process.env.FRONTEND_BASE_URL ?? 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  },
};
