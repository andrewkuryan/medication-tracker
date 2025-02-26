import { UserData, UserCredentialsData, User } from '@common/models/shared/User';
import { Session, SessionData } from '@common/models/server/Session';
import getClient from '@db/client';
import { insertQuery, selectQuery, updateQuery } from '@db/queries';
import {
  DBSession, DBUser, DBUserCredentials, sessionSchema, userCredentialsSchema, userSchema,
} from '@db/scheme/User';
import { eq } from '@db/where';
import { leftJoin } from '@db/join';
import {
  credentialsToDBCredentials,
  dbSessionJoinedToSession,
  dbSessionToSession,
  dbUserToUser,
  sessionToDBSession,
  userToDBUser,
  userToUserUpdate,
  UserUpdateData,
} from '@repository/converters/user';

export async function createUser(
  data: UserData,
  credentialsData: UserCredentialsData,
): Promise<User> {
  const dbClient = await getClient();
  const userResult = await dbClient.query<DBUser>(insertQuery(userSchema, userToDBUser(data)));
  const rawUser = userResult.rows[0];

  const credentialsResult = await dbClient.query<DBUserCredentials>(insertQuery(
    userCredentialsSchema,
    credentialsToDBCredentials(rawUser.id, credentialsData),
  ));
  const rawCredentials = credentialsResult.rows[0];

  return dbUserToUser({ ...rawUser, ...rawCredentials });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const dbClient = await getClient();
  const result = await dbClient.query<DBUser & DBUserCredentials>(selectQuery(userSchema, {
    where: eq('email', email),
    join: [leftJoin(userCredentialsSchema, 'id', 'user_id')],
  }));

  return result.rows[0] ? dbUserToUser(result.rows[0]) : null;
}

export async function updateUser(userId: number, newData: UserUpdateData): Promise<User> {
  const dbClient = await getClient();
  const result = await dbClient.query<DBUser & DBUserCredentials>(updateQuery(
    userSchema,
    userToUserUpdate(newData),
    {
      where: eq('id', userId),
      join: [leftJoin(userCredentialsSchema, 'id', 'user_id')],
    },
  ));

  return dbUserToUser(result.rows[0]);
}

export async function createSession(user: User, data: SessionData) {
  const dbClient = await getClient();
  const result = await dbClient.query<DBSession>(insertQuery(
    sessionSchema,
    sessionToDBSession(user.id, data),
  ));

  return dbSessionToSession(result.rows[0], user);
}

export async function getSession(sessionId: number): Promise<Session | null> {
  const dbClient = await getClient();
  const result = await dbClient.query<DBSession & DBUser & DBUserCredentials>(selectQuery(
    sessionSchema,
    {
      where: eq('id', sessionId),
      join: [
        leftJoin(userSchema, 'user_id', 'id'),
        leftJoin(userCredentialsSchema, 'user_id', 'user_id'),
      ],
    },
  ));

  return result.rows[0] ? dbSessionJoinedToSession(result.rows[0]) : null;
}
