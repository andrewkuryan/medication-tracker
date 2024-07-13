import { Router } from 'express';
import { Details } from 'express-useragent';
import * as yup from 'yup';

import { createSession, createUser, getUserByEmail } from '@repository/user';
import { User } from '@common/models/shared/User';
import { Session } from '@common/models/server/Session';
import { NotFoundError } from './errors';
import ServerSRPGenerator from '../utils/crypto/srp';

const router = Router();

const registerBodySchema = yup.object({
  user: yup.object({
    email: yup.string().required(),
  }).required(),
  credentials: yup.object({
    salt: yup.string().required(),
    verifierHex: yup.string().required(),
  }).required(),
  publicKeyHex: yup.string().required(),
});

const loginSchema = yup.object({
  user: yup.object({
    email: yup.string().required(),
  }).required(),
  publicKeyHex: yup.string().required(),
});

function serializeRegisterRes(user: User, sessionId: number, publicKey: bigint) {
  return { user, sessionId, publicKeyHex: publicKey.toString(16) };
}

function serializeLoginRes(salt: string, publicKey: bigint, sessionId: number) {
  return { salt, publicKeyHex: publicKey.toString(16), sessionId };
}

async function buildSession(
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

router.post('/register', async (req, res, next) => {
  try {
    const data = await registerBodySchema.validate(req.body);
    const user = await createUser(data.user, data.credentials);

    const verifier = BigInt(`0x${data.credentials.verifierHex}`);
    const { publicKey, privateKey } = req.srpGenerator.generateKeys(verifier);

    const session = await buildSession(req.srpGenerator, user, req.useragent, BigInt(`0x${data.publicKeyHex}`), publicKey, privateKey);

    res.json(serializeRegisterRes(user, session.id, publicKey));
  } catch (err: unknown) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const data = await loginSchema.validate(req.body);

    const user = await getUserByEmail(data.user.email);
    if (!user) {
      throw new NotFoundError('User', `email = ${data.user.email}`);
    }
    const verifier = BigInt(`0x${user.credentials.data.verifierHex}`);
    const { publicKey, privateKey } = req.srpGenerator.generateKeys(verifier);

    const session = await buildSession(req.srpGenerator, user, req.useragent, BigInt(`0x${data.publicKeyHex}`), publicKey, privateKey);

    res.json(serializeLoginRes(user.credentials.data.salt, publicKey, session.id));
  } catch (err: unknown) {
    next(err);
  }
});

export default router;
