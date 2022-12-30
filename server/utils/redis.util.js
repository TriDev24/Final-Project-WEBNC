import redis from "redis";
import dotenv from 'dotenv';

dotenv.config();

const client = redis.createClient({
  url:process.env.REDIS_URL
});

async function connectRedis() {
  try {
    await client.connect();
    console.log("Connected redis");
  } catch (err) {
    console.log(err);
  }
}

connectRedis();

export default client;
