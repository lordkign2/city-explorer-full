var {createClient} = require('redis');


const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://default:NflxDSW6td4sE0XnmbOCJ7PsRNhgCXDJ@redis-16197.c279.us-central1-1.gce.redns.redis-cloud.com:16197'
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;