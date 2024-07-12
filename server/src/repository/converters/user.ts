import {
  DBSession, DBSessionInsert, DBUser, DBUserCredentials, DBUserCredentialsInsert, DBUserInsert,
} from '@db/scheme/User';
import {
  Session, SessionData, User, UserCredentials, UserCredentialsData, UserData,
} from '../models/User';

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

export function dbSessionToSession(session: DBSession): Session {
  return {
    id: session.id,
    data: {
      kHex: session.k_hex,
      clientName: session.client_name,
      verified: session.verified,
    },
  };
}

export function sessionToDBSession(userId: number, sessionData: SessionData): DBSessionInsert {
  return {
    user_id: userId,
    k_hex: sessionData.kHex,
    client_name: sessionData.clientName,
    verified: sessionData.verified,
  };
}
