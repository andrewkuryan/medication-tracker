import {
  UserCredentialsData, UserData, User, UserCredentials,
} from '@common/models/shared/User';
import { Session, SessionData } from '@common/models/server/Session';
import {
  DBSession, DBSessionInsert, DBUser, DBUserCredentials, DBUserCredentialsInsert, DBUserInsert,
} from '@db/scheme/User';

export function dbCredentialsToCredentials(credentials: DBUserCredentials): UserCredentials {
  return {
    id: credentials.id,
    data: {
      salt: credentials.salt,
      verifierHex: credentials.verifier_hex,
    },
  };
}

export function credentialsToDBCredentials(
  userId: number,
  credentialsData: UserCredentialsData,
): DBUserCredentialsInsert {
  return {
    user_id: userId,
    salt: credentialsData.salt,
    verifier_hex: credentialsData.verifierHex,
  };
}

export function dbUserToUser(user: DBUser & DBUserCredentials): User {
  return {
    id: user.id,
    data: {
      email: user.email,
    },
    credentials: dbCredentialsToCredentials(user),
  };
}

export function userToDBUser(userData: UserData): DBUserInsert {
  return { email: userData.email };
}

export function dbSessionJoinedToSession(session: DBSession & DBUser & DBUserCredentials): Session {
  return {
    id: session.id,
    data: {
      clientIdentity: session.client_identity,
      serverIdentity: session.server_identity,
      clientName: session.client_name,
    },
    user: dbUserToUser(session),
  };
}

export function dbSessionToSession(session: DBSession, user: User): Session {
  return {
    id: session.id,
    data: {
      clientIdentity: session.client_identity,
      serverIdentity: session.server_identity,
      clientName: session.client_name,
    },
    user,
  };
}

export function sessionToDBSession(userId: number, sessionData: SessionData): DBSessionInsert {
  return {
    user_id: userId,
    client_identity: sessionData.clientIdentity,
    server_identity: sessionData.serverIdentity,
    client_name: sessionData.clientName,
  };
}
