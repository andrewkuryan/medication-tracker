import { Router } from 'express';
import * as yup from 'yup';

import { createMedication, getAllMedications, updateMedication } from '@repository/medication';
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
  count: yup.number().required()
    .min(0)
    .test('is-lte-destination-count', function isLteDestinationCount(count) {
      return count <= this.parent.destinationCount;
    }),
  destinationCount: yup.number().required()
    .min(1)
    .test('is-gte-count', function isGteCount(destinationCount) {
      return destinationCount >= this.parent.count;
    }),
  startDate: yup.string().required(),
});

const updateSchema = yup.object({
  id: yup.number().required(),
  name: yup.string(),
  description: yup.string().nullable().default(null),
  frequency: yup.object({
    amount: yup.number(),
    days: yup.number(),
  }),
  count: yup.number()
    .min(0)
    .test('is-lte-destination-count', function isLteDestinationCount(count) {
      return !count || !this.parent.destinationCount || count <= this.parent.destinationCount;
    }),
  destinationCount: yup.number()
    .min(1)
    .test('is-gte-count', function isGteCount(destinationCount) {
      return !destinationCount || !this.parent.count || destinationCount >= this.parent.count;
    }),
  startDate: yup.string(),
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
      startDate,
      endDate: calculateEndDate(startDate, data.count, data.destinationCount, data.frequency),
    });

    res.send(medication);
  } catch (err: unknown) {
    next(err);
  }
});

router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const data = await updateSchema.validate({ ...req.params, ...req.body });
    const startDate = data.startDate ? new Date(data.startDate) : undefined;
    const { frequency } = data;
    const endDate = (startDate
        && data.count
        && data.destinationCount
        && frequency
        && frequency.amount
        && frequency.days
    ) ? calculateEndDate(
        startDate,
        data.count,
        data.destinationCount,
        { amount: frequency.amount, days: frequency.days },
      ) : undefined;

    const medication = await updateMedication(data.id, { ...data, startDate, endDate });

    res.send(medication);
  } catch (err: unknown) {
    next(err);
  }
});

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new NotFoundError('User', 'me');
    }
    const medications = await getAllMedications(req.user);

    res.send(medications);
  } catch (err: unknown) {
    next(err);
  }
});

export default router;
