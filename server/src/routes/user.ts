import { Router } from 'express';
import * as yup from 'yup';

import { createUser, getUserByEmail, updateUser } from '@repository/user';
import { User } from '@common/models/shared/User';
import { NotFoundError } from './utils/errors';
import { authMiddleware, buildSession } from './utils/auth';

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

const loginBodySchema = yup.object({
  user: yup.object({
    email: yup.string().required(),
  }).required(),
  publicKeyHex: yup.string().required(),
});

const updateBodySchema = yup.object({
  gender: yup.string().nullable().default(null),
  birthDate: yup.string().nullable().default(null),
});

function serializeRegisterRes(user: User, sessionId: number, publicKey: bigint) {
  return { user, sessionId, publicKeyHex: publicKey.toString(16) };
}

function serializeLoginRes(salt: string, publicKey: bigint, sessionId: number) {
  return { salt, publicKeyHex: publicKey.toString(16), sessionId };
}

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new NotFoundError('User', 'me');
    }
    res.send(req.user);
  } catch (err: unknown) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const data = await registerBodySchema.validate(req.body);
    const user = await createUser(
      { ...data.user, birthDate: null, gender: null },
      data.credentials,
    );

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
    const data = await loginBodySchema.validate(req.body);

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

router.put('/me', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new NotFoundError('User', 'me');
    }
    const data = await updateBodySchema.validate(req.body);
    const birthDate = data.birthDate ? new Date(data.birthDate) : null;
    const user = await updateUser(req.user.id, { ...data, birthDate });

    res.send(user);
  } catch (err: unknown) {
    next(err);
  }
});

export default router;
