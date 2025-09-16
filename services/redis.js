// services/redis.js
import { createClient } from "redis";

const client = createClient({ url: process.env.REDIS_URL });

client.on("error", (err) => console.error("Redis error:", err));

(async () => {
  await client.connect();
  console.log("✅ Redis Connected");
})();

// Helper functions
export async function get(key) {
  return client.get(key);
}

export async function setEx(key, ttl, value) {
  return client.setEx(key, ttl, value);
}

export default client;
