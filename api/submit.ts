import { createClient } from 'redis';
import { config } from 'dotenv';

config(); // Load environment variables

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

redisClient.connect();

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const data = await req.json();
  await redisClient.set(data.gt_user, JSON.stringify(data));
  return new Response(
    "OK",
    {
      status: 201,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    }
  );
}
