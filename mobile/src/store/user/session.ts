import AsyncStorage from '@react-native-async-storage/async-storage';

import { Session } from '@common/models/client/Session';
import ClientSRPGenerator from '../../utils/crypto/srp';
import BackendApi from '../../api/BackendApi';

export function buildSession(
  srpGenerator: ClientSRPGenerator,
  sessionId: number,
  email: string,
  password :string,
  salt: string,
  publicKey: bigint,
  privateKey: bigint,
  serverPublicKey: bigint,
): Session {
  const sessionKey = srpGenerator.computeSessionKey(
    email,
    password,
    salt,
    publicKey,
    privateKey,
    serverPublicKey,
  );
  const identity = srpGenerator.computeClientIdentity(
    email,
    salt,
    publicKey,
    serverPublicKey,
    sessionKey,
  );
  const expectedIdentity = srpGenerator.computeServerIdentity(publicKey, identity, sessionKey);
  return {
    id: sessionId,
    clientIdentity: identity,
    serverIdentity: expectedIdentity,
  };
}

export function setSessionHeaders(api: BackendApi, session: Session) {
  api.setBaseHeaders({
    'x-session-id': session.id.toString(),
    authorization: `SRP-6a ${session.clientIdentity}`,
  });
  api.setBaseExpectedHeaders({
    authorization: { value: `SRP-6a ${session.serverIdentity}`, errorMessage: 'Cannot verify server identity' },
  });
}

export function resetSessionHeaders(api: BackendApi) {
  api.setBaseHeaders({});
  api.setBaseExpectedHeaders({});
}

export async function saveSession(session: Session) {
  await AsyncStorage.setItem('session', JSON.stringify(session));
}

export async function removeSession() {
  await AsyncStorage.removeItem('session');
}
