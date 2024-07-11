import pg from 'pg';
import dotenv from 'dotenv';
import * as process from 'node:process';

dotenv.config();

const client = new pg.Client({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT ?? '', 10),
});

const connectPromise = client.connect();

export default async function getClient() {
  await connectPromise;
  return client;
}
