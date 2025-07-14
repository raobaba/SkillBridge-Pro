
const { redisClient } = require("../config/redis");

const CACHE_TTL = 300; // 5 minutes in seconds

const cacheMiddleware = (duration = CACHE_TTL) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        console.log("Cache hit for:", key);
        return res.json(JSON.parse(cachedData));
      }

      // Store original send function
      const originalSend = res.send;

      // Override send function to cache the response
      res.send = function (data) {
        // Cache the response
        redisClient.setEx(key, duration, JSON.stringify(data));

        // Restore original send function
        res.send = originalSend;

        // Send the response
        return res.send(data);
      };

      next();
    } catch (error) {
      console.error("Cache Error:", error);
      next();
    }
  };
};

const clearCache = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Cleared cache for pattern: ${pattern}`);
    }
  } catch (error) {
    console.error("Clear Cache Error:", error);
  }
};

module.exports = {
  cacheMiddleware,
  clearCache,
};
