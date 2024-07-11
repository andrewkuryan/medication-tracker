import { Router } from 'express';
import * as yup from 'yup';

import { createUser } from '@repository/user';
import { User } from '@repository/models/User';

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

function serializeUser(user: User) {
  return { id: user.id, data: user.data };
}

router.post('/register', async (req, res) => {
  const data = await registerBodySchema.validate(req.body);
  const user = await createUser(data.user, data.credentials);
  res.json(serializeUser(user));
});

export default router;
