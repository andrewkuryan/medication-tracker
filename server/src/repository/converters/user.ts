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
      key: session.key,
      serverPublicKeyHex: session.server_public_key_hex,
      clientPublicKeyHex: session.client_public_key_hex,
      clientName: session.client_name,
      verified: session.verified,
    },
  };
}

export function sessionToDBSession(userId: number, sessionData: SessionData): DBSessionInsert {
  return {
    user_id: userId,
    key: sessionData.key,
    server_public_key_hex: sessionData.serverPublicKeyHex,
    client_public_key_hex: sessionData.clientPublicKeyHex,
    client_name: sessionData.clientName,
    verified: sessionData.verified,
  };
}
