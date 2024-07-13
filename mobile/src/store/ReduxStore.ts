import { configureStore } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import serviceReducer, { ServiceActionType, ServiceState } from './service/reducer';
import BackendApi from '../api/BackendApi';
import ClientSRPGenerator from '../utils/crypto/srp';

export interface AppState {
    service: ServiceState;
}

export type AppAction = ServiceActionType;

const createStore = (api: BackendApi, srpGenerator: ClientSRPGenerator) => configureStore({
  reducer: {
    service: serviceReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type AppDispatch = ReturnType<typeof createStore>['dispatch'];

export default createStore;
