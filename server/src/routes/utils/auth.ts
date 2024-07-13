import { NextFunction, Request, Response } from 'express';
import { Details } from 'express-useragent';

import { User } from '@common/models/shared/User';
import { Session } from '@common/models/server/Session';
import { createSession, getSession } from '@repository/user';
import ServerSRPGenerator from '../../utils/crypto/srp';
import { UnauthorizedError } from './errors';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace, no-shadow
    namespace Express {
        // eslint-disable-next-line no-shadow
        export interface Request {
            user?: User;
        }
    }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.header('x-session-id');
  const authorization = req.header('authorization');
  if (sessionId && authorization) {
    const [protocol, token] = authorization.split(' ');
    if (protocol !== 'SRP-6a') {
      return next(new UnauthorizedError('User', 'Unsupported protocol'));
    }
    const session = await getSession(parseInt(sessionId, 10));
    if (session?.data.clientIdentity === token) {
      req.user = session.user;
      res.header('authorization', `SRP-6a ${session.data.serverIdentity}`);
      return next();
    }
    return next(new UnauthorizedError('User', 'Unauthorized'));
  }
  return next(new UnauthorizedError('User', 'Unauthorized'));
}

export async function buildSession(
  srpGenerator: ServerSRPGenerator,
  user: User,
  useragent: Details | undefined,
  clientPublicKey: bigint,
  serverPublicKey: bigint,
  privateKey: bigint,
): Promise<Session> {
  const sessionKey = srpGenerator.computeSessionKey(
    clientPublicKey,
    BigInt(`0x${user.credentials.data.verifierHex}`),
    privateKey,
    serverPublicKey,
  );

  const expectedIdentity = srpGenerator.computeClientIdentity(
    user.data.email,
    user.credentials.data.salt,
    clientPublicKey,
    serverPublicKey,
    sessionKey,
  );
  const identity = srpGenerator.computeServerIdentity(
    clientPublicKey,
    expectedIdentity,
    sessionKey,
  );

  return createSession(user, {
    clientIdentity: expectedIdentity,
    serverIdentity: identity,
    clientName: useragent?.platform ?? useragent?.source ?? 'Unknown',
  });
}
