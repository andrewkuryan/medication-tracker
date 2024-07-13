import { Dispatch, MiddlewareAPI } from 'redux';
import { CaseReducerActions, SliceCaseReducers } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import { AppAction, AppState } from './ReduxStore';

export type SliceActionType<A extends CaseReducerActions<SliceCaseReducers<AppState>, string>> = {
    [key in keyof A]: ReturnType<A[key]>;
};

export type AppDispatch = Dispatch<AppAction[keyof AppAction]>
export type StoreAPI = MiddlewareAPI<AppDispatch, AppState>

export const actionMiddleware = <T extends keyof AppAction>(
  storeName: keyof AppState,
  actionName: T,
  middleware: (storeApi: StoreAPI, action: AppAction[T]) => AppAction[T],
) => (storeApi: StoreAPI) => (next: AppDispatch) => (action: AppAction[T]) => {
    if (action.type === `${storeName}/${actionName}`) {
      return next(middleware(storeApi, action));
    }
    return next(action);
  };
