

const { createClient } = require("redis");
// Initializes and manages a Redis client with custom reconnect logic, 
// connection event handling, and an asynchronous connection function.
const redisClient = createClient({
  url: "redis://107.155.65.157:6378",
  socket: {
    connectTimeout: 10000,
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        console.error("Max reconnection attempts reached");
        return new Error("Max reconnection attempts reached");
      }
      return Math.min(retries * 1000, 3000);
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
  if (err.code === "ECONNREFUSED") {
    console.error(
      "Connection refused. Please check if Redis server is running and accessible."
    );
  }
});

redisClient.on("connect", () => console.log("Redis Client Connected"));
redisClient.on("reconnecting", () =>
  console.log("Redis Client Reconnecting...")
);
redisClient.on("end", () => console.log("Redis Client Connection Ended"));
// Attempts to connect to Redis if not already connected
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      console.log("Attempting to connect to Redis...");
      await redisClient.connect();
    }
  } catch (error) {
    console.error("Redis Connection Error:", error.message);
    throw error;
  }
};

module.exports = {
  redisClient,
  connectRedis,
};
