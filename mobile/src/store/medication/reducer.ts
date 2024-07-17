import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Medication } from '@common/models/shared/Medication';
// eslint-disable-next-line import/no-cycle
import { SliceActionType } from '../utils';
// eslint-disable-next-line import/no-cycle
import {
  CreateStartPayload, CreateSuccessPayload, FetchAllSuccessPayload, UpdateStartPayload,
} from './middleware';

export interface MedicationState {
    medications: { [id: number]: Medication };
}

const initialState: MedicationState = {
  medications: [],
};

const medicationSlice = createSlice({
  name: 'medication',
  initialState,
  reducers: {
    fetchAll() {},
    fetchAllSuccess(state, action: PayloadAction<FetchAllSuccessPayload>) {
      for (let i = 0; i < action.payload.medications.length; i += 1) {
        const medication = action.payload.medications[i];
        // eslint-disable-next-line no-param-reassign
        state.medications[medication.id] = medication;
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(_, action: PayloadAction<CreateStartPayload>) {},
    createSuccess(state, action: PayloadAction<CreateSuccessPayload>) {
      // eslint-disable-next-line no-param-reassign
      state.medications[action.payload.medication.id] = action.payload.medication;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(_, action: PayloadAction<UpdateStartPayload>) {},
    updateSuccess(state, action: PayloadAction<CreateSuccessPayload>) {
      // eslint-disable-next-line no-param-reassign
      state.medications[action.payload.medication.id] = action.payload.medication;
    },
  },
});

export const {
  fetchAll, fetchAllSuccess, create, createSuccess, update, updateSuccess,
} = medicationSlice.actions;

export type MedicationActionType = SliceActionType<typeof medicationSlice.actions>;

export default medicationSlice.reducer;
