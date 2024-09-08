import express from 'express';
import { config } from 'dotenv';
import { createClient } from 'redis';

config();

const app = express();
const port = process.env.PORT || 3000;

const client = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD
});

client.connect();

app.use(express.json());

app.post('/api/submit', async (req, res) => {
  const data = req.body;
  await client.set(data.gt_user, JSON.stringify(data));
  res.status(201).send("OK");
});

app.get('/api/get', async (req, res) => {
  const user = String(req.query.userid);
  const data = await client.get(user);
  await client.del(user);
  res.status(data ? 200 : 204).json(data ? JSON.parse(data) : null);
});

app.get('/api/block', async (req, res) => {
  const user = String(req.query.userid);
  let data = await client.get(user);
  let status = 200;
  const start = Date.now();
  while (!data && Date.now() - start < 28 * 1000) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    data = await client.get(user);
  }
  if (data) {
    await client.del(user);
    res.status(status).json(JSON.parse(data));
  } else {
    res.status(503).json({ error: "timed out" });
  }
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
