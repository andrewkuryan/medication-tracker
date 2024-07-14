import { Middleware } from '@reduxjs/toolkit';

import { User } from '@common/models/shared/User';
// eslint-disable-next-line import/no-cycle
import { actionMiddleware } from '../utils';
// eslint-disable-next-line import/no-cycle
import { requestWrap } from '../service/wrappers';
// eslint-disable-next-line import/no-cycle
import { fetch as fetchUser, fetchSuccess, registerSuccess } from './reducer';
import { AppState } from '../ReduxStore';
import { buildSession, setSessionHeaders, saveSession } from './session';
import BackendApi from '../../api/BackendApi';
import ClientSRPGenerator from '../../utils/crypto/srp';

export interface LoginStartPayload {
    email: string;
    password: string;
}

export interface LoginSuccessPayload {
    user: User;
}

export interface RegisterResponse {
    user: User;
    sessionId: number;
    publicKeyHex: string;
}

const register = (api: BackendApi, srpGenerator: ClientSRPGenerator) => actionMiddleware(
  'user',
  'register',
  (storeApi, action) => {
    requestWrap(storeApi, async () => {
      const { email, password } = action.payload;
      const { salt, verifier } = srpGenerator.generateSaltVerifier(email, password);
      const { privateKey, publicKey } = srpGenerator.generateKeys();
      const {
        user,
        sessionId,
        publicKeyHex: serverPublicKeyHex,
      } = await api.post<RegisterResponse>({
        url: '/users/register',
        body: {
          user: { email },
          credentials: { salt, verifierHex: verifier.toString(16) },
          publicKeyHex: publicKey.toString(16),
        },
      });
      const session = buildSession(srpGenerator, sessionId, email, password, salt, publicKey, privateKey, BigInt(`0x${serverPublicKeyHex}`));
      setSessionHeaders(api, session);
      await saveSession(session);

      storeApi.dispatch(registerSuccess({ user }));
    });
    return action;
  },
);

export interface LoginResponse {
    salt: string;
    sessionId: number;
    publicKeyHex: string;
}

const fetchMiddleware = (api: BackendApi) => actionMiddleware(
  'user',
  'fetch',
  (storeApi, action) => {
    requestWrap(storeApi, async () => {
      const user = await api.get<User>({ url: '/users/me' });

      storeApi.dispatch(fetchSuccess({ user }));
    });
    return action;
  },
);

const login = (api: BackendApi, srpGenerator: ClientSRPGenerator) => actionMiddleware(
  'user',
  'login',
  (storeApi, action) => {
    requestWrap(storeApi, async () => {
      const { email, password } = action.payload;
      const { privateKey, publicKey } = srpGenerator.generateKeys();
      const { salt, sessionId, publicKeyHex: serverPublicKeyHex } = await api.post<LoginResponse>({
        url: '/users/login',
        body: { user: { email }, publicKeyHex: publicKey.toString(16) },
      });

      const session = buildSession(srpGenerator, sessionId, email, password, salt, publicKey, privateKey, BigInt(`0x${serverPublicKeyHex}`));
      setSessionHeaders(api, session);
      await saveSession(session);

      storeApi.dispatch(fetchUser());
    });
    return action;
  },
);

const getUserMiddlewares = (api: BackendApi, srpGenerator: ClientSRPGenerator) => [
    // eslint-disable-next-line @typescript-eslint/ban-types
    fetchMiddleware(api) as Middleware<{}, AppState>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    register(api, srpGenerator) as Middleware<{}, AppState>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    login(api, srpGenerator) as Middleware<{}, AppState>,
];

export default getUserMiddlewares;
