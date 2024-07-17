import { Middleware } from '@reduxjs/toolkit';

import { Medication, MedicationData } from '@common/models/shared/Medication';
// eslint-disable-next-line import/no-cycle
import { actionMiddleware } from '../utils';
// eslint-disable-next-line import/no-cycle
import { requestWrap } from '../service/wrappers';
import { AppState } from '../ReduxStore';
// eslint-disable-next-line import/no-cycle
import { createSuccess } from './reducer';
import BackendApi from '../../api/BackendApi';

export type CreateStartPayload = Omit<MedicationData, 'endDate'>

export interface CreateSuccessPayload {
    medication: Medication;
}

const create = (api: BackendApi) => actionMiddleware(
  'medication',
  'create',
  (storeApi, action) => {
    requestWrap(storeApi, async () => {
      const medication = await api.post<Medication>({ url: '/medications', body: action.payload });

      storeApi.dispatch(createSuccess({ medication }));
    });
    return action;
  },
);

const getMedicationMiddlewares = (api: BackendApi) => [
    // eslint-disable-next-line @typescript-eslint/ban-types
    create(api) as Middleware<{}, AppState>,
];

export default getMedicationMiddlewares;
