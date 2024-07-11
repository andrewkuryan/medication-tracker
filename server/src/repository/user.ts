import getClient from '@db/client';
import { insertQuery } from '@db/queries';
import {
  DBUser, DBUserCredentials, userCredentialsSchema, userSchema,
} from '@db/scheme/User';
import { User, UserCredentialsData, UserData } from './models/User';
import { parseUser } from './parsers/user';

export async function createUser(
  data: UserData,
  credentialsData: UserCredentialsData,
): Promise<User> {
  const dbClient = await getClient();
  const userResult = await dbClient.query<DBUser>(insertQuery(userSchema, { email: data.email }));
  const rawUser = userResult.rows[0];

  const credentialsResult = await dbClient.query<DBUserCredentials>(insertQuery(
    userCredentialsSchema,
    { user_id: rawUser.id, salt: credentialsData.salt, verifier_hex: credentialsData.verifierHex },
  ));
  const rawCredentials = credentialsResult.rows[0];

  return parseUser({ ...rawUser, ...rawCredentials });
}
