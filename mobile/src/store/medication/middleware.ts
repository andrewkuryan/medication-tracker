import { Middleware } from '@reduxjs/toolkit';

import { Medication, MedicationData } from '@common/models/shared/Medication';
// eslint-disable-next-line import/no-cycle
import { actionMiddleware } from '../utils';
// eslint-disable-next-line import/no-cycle
import { requestWrap } from '../service/wrappers';
import { AppState } from '../ReduxStore';
// eslint-disable-next-line import/no-cycle
import { createSuccess, fetchAllSuccess } from './reducer';
import BackendApi from '../../api/BackendApi';

export type MedicationResponse = Omit<Medication, 'data'> & {
    data: Omit<MedicationData, 'startDate' | 'endDate'> & {
        startDate: string;
        endDate: string;
    }
}

function parseMedication(response: MedicationResponse): Medication {
  return {
    ...response,
    data: {
      ...response.data,
      startDate: new Date(response.data.startDate),
      endDate: new Date(response.data.endDate),
    },
  };
}

export type CreateStartPayload = Omit<MedicationData, 'endDate'>

export interface CreateSuccessPayload {
    medication: Medication;
}

const create = (api: BackendApi) => actionMiddleware(
  'medication',
  'create',
  (storeApi, action) => {
    requestWrap(storeApi, async () => {
      const result = await api.post<MedicationResponse>({ url: '/medications', body: action.payload });

      storeApi.dispatch(createSuccess({ medication: parseMedication(result) }));
    });
    return action;
  },
);

export interface FetchAllSuccessPayload {
    medications: Medication[];
}

const fetchAll = (api: BackendApi) => actionMiddleware(
  'medication',
  'fetchAll',
  (storeApi, action) => {
    requestWrap(storeApi, async () => {
      const result = await api.get<MedicationResponse[]>({ url: '/medications' });

      storeApi.dispatch(fetchAllSuccess({ medications: result.map(parseMedication) }));
    });
    return action;
  },
);

const getMedicationMiddlewares = (api: BackendApi) => [
    // eslint-disable-next-line @typescript-eslint/ban-types
    create(api) as Middleware<{}, AppState>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    fetchAll(api) as Middleware<{}, AppState>,
];

export default getMedicationMiddlewares;
