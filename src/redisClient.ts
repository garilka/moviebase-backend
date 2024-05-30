import { createClient } from 'redis';
import { config } from './config/config.ts';

const redisClient = createClient({ url: config.redisBaseUrl + config.redisPort });

redisClient.on('ready', () => {
  console.log(`Connected to Redis on port ${config.redisPort}`);
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export { redisClient };
