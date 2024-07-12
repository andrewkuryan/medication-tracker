import { Router } from 'express';
import * as yup from 'yup';

import {
  createSession, createUser, getSession, getUserByEmail, markSessionVerified,
} from '@repository/user';
import { User } from '@repository/models/User';
import { NotFoundError, UnauthorizedError } from './errors';

const router = Router();

const registerBodySchema = yup.object({
  user: yup.object({
    email: yup.string().required(),
  }).required(),
  credentials: yup.object({
    salt: yup.string().required(),
    verifierHex: yup.string().required(),
  }).required(),
});

const loginInitSchema = yup.object({
  email: yup.string().required(),
  publicKeyHex: yup.string().required(),
});

const loginVerifySchema = yup.object({
  email: yup.string().required(),
  identity: yup.string().required(),
});

function serializeUser(user: User) {
  return { id: user.id, data: user.data };
}

function serializeLoginInitRes(salt: string, publicKey: bigint, sessionId: number) {
  return { salt, publicKeyHex: publicKey.toString(16), sessionId };
}

function serializeLoginVerifyRes(user: User, serverIdentity: string) {
  return { user: serializeUser(user), identity: serverIdentity };
}

router.post('/register', async (req, res, next) => {
  try {
    const data = await registerBodySchema.validate(req.body);
    const user = await createUser(data.user, data.credentials);
    res.json(serializeUser(user));
  } catch (err: unknown) {
    next(err);
  }
});

router.post('/login/init', async (req, res, next) => {
  try {
    const data = await loginInitSchema.validate(req.body);
    const user = await getUserByEmail(data.email);
    if (!user) {
      throw new NotFoundError('User', `email = ${data.email}`);
    }
    const verifier = BigInt(`0x${user.credentials.data.verifierHex}`);
    const { publicKey, privateKey } = req.srpGenerator.generateKeys(verifier);
    const sessionKey = req.srpGenerator.computeSessionKey(
      BigInt(`0x${data.publicKeyHex}`),
      verifier,
      privateKey,
      publicKey,
    );

    const session = await createSession(user, {
      key: sessionKey,
      serverPublicKeyHex: publicKey.toString(16),
      clientPublicKeyHex: data.publicKeyHex,
      clientName: req.useragent?.platform ?? req.useragent?.source ?? 'Unknown',
      verified: false,
    });
    res.json(serializeLoginInitRes(user.credentials.data.salt, publicKey, session.id));
  } catch (err: unknown) {
    next(err);
  }
});

router.post('/login/verify', async (req, res, next) => {
  try {
    const data = await loginVerifySchema.validate(req.body);
    const sessionId = req.header('session-id');
    const user = await getUserByEmail(data.email);
    const session = sessionId ? await getSession(parseInt(sessionId, 10)) : null;
    if (!user) {
      throw new NotFoundError('User', `email = ${data.email}`);
    }
    if (!session) {
      throw new NotFoundError('Session', `id = ${sessionId}`);
    }

    const clientPublicKey = BigInt(`0x${session.data.clientPublicKeyHex}`);
    const serverPublicKey = BigInt(`0x${session.data.serverPublicKeyHex}`);

    const expectedIdentity = req.srpGenerator.computeClientIdentity(
      data.email,
      user.credentials.data.salt,
      clientPublicKey,
      serverPublicKey,
      session.data.key,
    );

    if (expectedIdentity === data.identity) {
      await markSessionVerified(session.id);
      const identity = req.srpGenerator.computeServerIdentity(
        clientPublicKey,
        data.identity,
        session.data.key,
      );

      res.send(serializeLoginVerifyRes(user, identity));
    } else {
      throw new UnauthorizedError('User', 'Identity does not match the expected one');
    }
  } catch (err: unknown) {
    next(err);
  }
});

export default router;
