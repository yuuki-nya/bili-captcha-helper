import { createClient } from 'redis';
import { config } from 'dotenv';

config(); // Load environment variables

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

redisClient.connect();

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const user = String(url.searchParams.get("userid"));
  const data = await redisClient.get(user);
  await redisClient.del(user);
  return new Response(
    data ? JSON.stringify(data) : null,
    {
      status: data ? 200 : 204,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
}
