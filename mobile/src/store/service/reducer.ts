import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import { SliceActionType } from '../utils';

export interface ServiceState {
    isFetching: boolean;
    error: string | null;
}

const initialState: ServiceState = { isFetching: false, error: null };

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    startFetching(state) {
      // eslint-disable-next-line no-param-reassign
      state.isFetching = true;
    },
    finishFetching(state) {
      // eslint-disable-next-line no-param-reassign
      state.isFetching = false;
    },
    setError(state, action: PayloadAction<{ error: string, code: number | null }>) {
      // eslint-disable-next-line no-param-reassign
      state.error = action.payload.error;
    },
    resetError(state) {
      // eslint-disable-next-line no-param-reassign
      state.error = null;
    },
  },
});

export const {
  startFetching, finishFetching, setError, resetError,
} = serviceSlice.actions;

export type ServiceActionType = SliceActionType<typeof serviceSlice.actions>;

export default serviceSlice.reducer;
