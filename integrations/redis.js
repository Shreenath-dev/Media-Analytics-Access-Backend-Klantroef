import { createClient } from "redis";
import config from "@/config";

export const redisClient = createClient({ url: config.REDIS_URI });
redisClient.on("error", (err) => console.log("Redis Client Error", err));
(async () => {
  await redisClient.connect();
  console.log("Redis connected successfully.");
})();
