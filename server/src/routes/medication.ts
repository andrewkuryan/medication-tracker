import { Router } from 'express';
import * as yup from 'yup';

import { createMedication } from '@repository/medication';
import { calculateEndDate } from '@common/models/shared/Medication';
import { authMiddleware } from './utils/auth';
import { NotFoundError } from './utils/errors';

const router = Router();

const createBodySchema = yup.object({
  name: yup.string().required(),
  description: yup.string().nullable().default(null),
  frequency: yup.object({
    amount: yup.number().required(),
    days: yup.number().required(),
  }).required(),
  destinationCount: yup.number().required(),
  startDate: yup.string().required(),
});

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new NotFoundError('User', 'me');
    }
    const data = await createBodySchema.validate(req.body);
    const startDate = new Date(data.startDate);
    const medication = await createMedication(req.user, {
      ...data,
      count: 0,
      startDate,
      endDate: calculateEndDate(startDate, data.destinationCount, data.frequency),
    });

    res.send(medication);
  } catch (err: unknown) {
    next(err);
  }
});

export default router;
