import getClient from '@db/client';
import { createTableQuery, dropTableQuery } from '@db/queries';
import { sessionSchema, userCredentialsSchema, userSchema } from '@db/scheme/User';
import { medicationSchema } from '@db/scheme/Medication';

export async function migrate() {
  const client = await getClient();
  await client.query(createTableQuery(userSchema));
  await client.query(createTableQuery(userCredentialsSchema));
  await client.query(createTableQuery(sessionSchema));
  await client.query(createTableQuery(medicationSchema));
}

export async function rollback() {
  const client = await getClient();
  await client.query(dropTableQuery(medicationSchema));
  await client.query(dropTableQuery(sessionSchema));
  await client.query(dropTableQuery(userCredentialsSchema));
  await client.query(dropTableQuery(userSchema));
}
