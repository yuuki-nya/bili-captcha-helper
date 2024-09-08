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

function sleep(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const user = String(url.searchParams.get("userid"));
  let data = await redisClient.get(user);
  let status = 200;
  const start = Date.now();
  while (!data && Date.now() - start < 28 * 1000) {
    await sleep(1000);
    data = await redisClient.get(user);
  }
  if (data) {
    await redisClient.del(user);
  } else {
    data = {
      error: "timed out"
    };
    status = 503;
  }
  return new Response(
    JSON.stringify(data),
    {
      status: status,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
}
