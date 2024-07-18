import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '@common/models/shared/User';
// eslint-disable-next-line import/no-cycle
import { SliceActionType } from '../utils';
// eslint-disable-next-line import/no-cycle
import {
  EditStartPayload, EditSuccessPayload, LoginStartPayload, LoginSuccessPayload,
} from './middleware';

export interface UserState {
    current: User | null;
}

const initialState: UserState = {
  current: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetch() {},
    fetchSuccess(state, action: PayloadAction<LoginSuccessPayload>) {
      // eslint-disable-next-line no-param-reassign
      state.current = action.payload.user;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    register(_, action: PayloadAction<LoginStartPayload>) {},
    registerSuccess(state, action: PayloadAction<LoginSuccessPayload>) {
      // eslint-disable-next-line no-param-reassign
      state.current = action.payload.user;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    login(_, action: PayloadAction<LoginStartPayload>) {},
    logout() {},
    logoutSuccess(state) {
      // eslint-disable-next-line no-param-reassign
      state.current = null;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    edit(_, action: PayloadAction<EditStartPayload>) {},
    editSuccess(state, action: PayloadAction<EditSuccessPayload>) {
      // eslint-disable-next-line no-param-reassign
      state.current = action.payload.user;
    },
  },
});

export const {
  fetch, fetchSuccess, register, registerSuccess, login, logout, logoutSuccess, edit, editSuccess,
} = userSlice.actions;

export type UserActionType = SliceActionType<typeof userSlice.actions>;

export default userSlice.reducer;
