import { configureStore } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import serviceReducer, { ServiceActionType, ServiceState } from './service/reducer';
// eslint-disable-next-line import/no-cycle
import userReducer, { UserActionType, UserState } from './user/reducer';
import getUserMiddlewares from './user/middleware';
import BackendApi from '../api/BackendApi';
import ClientSRPGenerator from '../utils/crypto/srp';

export interface AppState {
    service: ServiceState;
    user: UserState;
}

export type AppAction = ServiceActionType & UserActionType

const createStore = (api: BackendApi, srpGenerator: ClientSRPGenerator) => configureStore({
  reducer: {
    service: serviceReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    .concat(getUserMiddlewares(api, srpGenerator)),
});

export type AppDispatch = ReturnType<typeof createStore>['dispatch'];

export default createStore;
