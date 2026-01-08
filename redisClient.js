//redisClient.js
var {createClient} = require('redis');


const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
  console.log('⚠️  Application will continue without Redis caching');
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err.message);
    // Don't throw error, let the app continue without Redis
  }
})();

module.exports = redisClient;