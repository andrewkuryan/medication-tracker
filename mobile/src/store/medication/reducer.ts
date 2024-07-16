import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Medication } from '@common/models/shared/Medication';
// eslint-disable-next-line import/no-cycle
import { SliceActionType } from '../utils';
// eslint-disable-next-line import/no-cycle
import { CreateStartPayload, CreateSuccessPayload } from './middleware';

export interface MedicationState {
    medications: Medication[];
}

const initialState: MedicationState = {
  medications: [],
};

const medicationSlice = createSlice({
  name: 'medication',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(_, action: PayloadAction<CreateStartPayload>) {},
    createSuccess(state, action: PayloadAction<CreateSuccessPayload>) {
      // eslint-disable-next-line no-param-reassign
      state.medications.push(action.payload.medication);
    },
  },
});

export const { create, createSuccess } = medicationSlice.actions;

export type MedicationActionType = SliceActionType<typeof medicationSlice.actions>;

export default medicationSlice.reducer;
