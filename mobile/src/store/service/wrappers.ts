// eslint-disable-next-line import/no-cycle
import { StoreAPI } from '../utils';
import { finishFetching, setError, startFetching } from './reducer';
import { ApiError } from '../../api/BackendApi';

export const fetchWrap = <T>(storeApi: StoreAPI, fn: () => Promise<T>) => {
  Promise.resolve()
    .then(() => storeApi.dispatch(startFetching()))
    .then(() => fn())
    .finally(() => storeApi.dispatch(finishFetching()));
};

export const catchWrap = <T>(
  storeApi: StoreAPI,
  promise: Promise<T>,
): Promise<T | null> => promise.catch((err) => {
    storeApi.dispatch(setError({
      error: err.message ?? 'Something went wrong',
      code: err instanceof ApiError ? err.code : null,
    }));
    return null;
  });

export const requestWrap = <T>(storeApi: StoreAPI, fn: () => Promise<T>) => {
  fetchWrap(storeApi, () => catchWrap(storeApi, fn()));
};
