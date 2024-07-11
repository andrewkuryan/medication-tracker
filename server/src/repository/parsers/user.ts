import { DBUser, DBUserCredentials } from '@db/scheme/User';
import { User, UserCredentials } from '../models/User';

export function parseUserCredentials(credentials: DBUserCredentials): UserCredentials {
  return {
    id: credentials.id,
    data: {
      salt: credentials.salt,
      verifierHex: credentials.verifier_hex,
    },
  };
}

export function parseUser(user: DBUser & DBUserCredentials): User {
  return {
    id: user.id,
    data: {
      email: user.email,
    },
    credentials: parseUserCredentials(user),
  };
}
