import { Middleware } from '@reduxjs/toolkit';

import { User, UserData } from '@common/models/shared/User';
// eslint-disable-next-line import/no-cycle
import { actionMiddleware } from '../utils';
// eslint-disable-next-line import/no-cycle
import { requestWrap } from '../service/wrappers';
// eslint-disable-next-line import/no-cycle
import {
  editSuccess,
  fetch as fetchUser,
  fetchSuccess,
  logout as logoutStart,
  logoutSuccess,
  registerSuccess,
} from './reducer';
import { AppState } from '../ReduxStore';
import {
  buildSession, setSessionHeaders, saveSession, removeSession, resetSessionHeaders,
} from './session';
import BackendApi from '../../api/BackendApi';
import ClientSRPGenerator from '../../utils/crypto/srp';

export type UserResponse = Omit<User, 'data'> & {
    data: Omit<UserData, 'birthDate'> & {
        birthDate: string | null;
    }
}

function parseUser(response: UserResponse): User {
  return {
    ...response,
    data: {
      ...response.data,
      birthDate: response.data.birthDate ? new Date(response.data.birthDate) : null,
    },
  };
}

export interface LoginStartPayload {
    email: string;
    password: string;
}

export interface LoginSuccessPayload {
    user: User;
}

export interface RegisterResponse {
    user: UserResponse;
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
        user: userResult,
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

      storeApi.dispatch(registerSuccess({ user: parseUser(userResult) }));
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
      const result = await api.get<UserResponse>({ url: '/users/me' });

      storeApi.dispatch(fetchSuccess({ user: parseUser(result) }));
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

const logout = (api: BackendApi) => actionMiddleware(
  'user',
  'logout',
  (storeApi, action) => {
    removeSession().then(() => {
      resetSessionHeaders(api);
      storeApi.dispatch(logoutSuccess());
    });
    return action;
  },
);

const logoutOnNotAuthorized = actionMiddleware(
  'service',
  'setError',
  (storeApi, action) => {
    if (action.payload.code === 401) {
      storeApi.dispatch(logoutStart());
    }
    return action;
  },
);

export type EditStartPayload = Omit<UserData, 'email'>;

export interface EditSuccessPayload {
    user: User;
}

const edit = (api: BackendApi) => actionMiddleware(
  'user',
  'edit',
  (storeApi, action) => {
    requestWrap(storeApi, async () => {
      const result = await api.put<UserResponse>({ url: '/users/me', body: action.payload });

      storeApi.dispatch(editSuccess({ user: parseUser(result) }));
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
    // eslint-disable-next-line @typescript-eslint/ban-types
    logout(api) as Middleware<{}, AppState>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    logoutOnNotAuthorized as Middleware<{}, AppState>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    edit(api) as Middleware<{}, AppState>,
];

export default getUserMiddlewares;
