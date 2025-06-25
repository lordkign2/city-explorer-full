// middleware/cache.js
const redisClient = require('../redisClient');

// Cache middleware for any route
const cache = (keyBuilder) => {
  return async (req, res, next) => {
    const key = typeof keyBuilder === 'function' ? keyBuilder(req) : keyBuilder;

    try {
      const cached = await redisClient.get(key);
      if (cached) {
        console.log(`✅ Cache hit for: ${key}`);
        return res.json(JSON.parse(cached));
      }

      // Override res.json to intercept response and store in cache
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        redisClient.setEx(key, 3600, JSON.stringify(data)); // 1 hour cache
        return originalJson(data);
      };

      next();
    } catch (err) {
      console.error(`❌ Redis cache error: ${err.message}`);
      next();
    }
  };
};

module.exports = { cache };