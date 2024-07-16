import { configureStore } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import serviceReducer, { ServiceActionType, ServiceState } from './service/reducer';
// eslint-disable-next-line import/no-cycle
import userReducer, { UserActionType, UserState } from './user/reducer';
import getUserMiddlewares from './user/middleware';
// eslint-disable-next-line import/no-cycle
import medicationReducer, { MedicationActionType, MedicationState } from './medication/reducer';
import getMedicationMiddlewares from './medication/middleware';
import BackendApi from '../api/BackendApi';
import ClientSRPGenerator from '../utils/crypto/srp';

export interface AppState {
    service: ServiceState;
    user: UserState;
    medication: MedicationState;
}

export type AppAction = ServiceActionType & UserActionType & MedicationActionType;

const createStore = (api: BackendApi, srpGenerator: ClientSRPGenerator) => configureStore({
  reducer: {
    service: serviceReducer,
    user: userReducer,
    medication: medicationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    .concat(getUserMiddlewares(api, srpGenerator))
    .concat(getMedicationMiddlewares(api)),
});

export type AppDispatch = ReturnType<typeof createStore>['dispatch'];

export default createStore;
