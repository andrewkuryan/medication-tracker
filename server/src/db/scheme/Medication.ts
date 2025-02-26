import {
  DateType, Integer, Real, Serial, TextType, Timestamp, Varchar,
} from '../Schema';
import { InsertSchemaType, SchemaType } from '../SchemaType';
import { userSchema } from './User';

export const medicationSchema = {
  tableName: 'medications',
  columns: {
    id: { type: Serial, options: 'PRIMARY KEY', default: true },
    user_id: { type: Integer(), options: `REFERENCES ${userSchema.tableName} (id)` },
    name: { type: Varchar(255, false) },
    description: { type: TextType(true) },
    frequency_amount: { type: Real() },
    frequency_days: { type: Real() },
    count: { type: Integer(), options: 'DEFAULT 0', default: true },
    destination_count: { type: Integer() },
    start_date: { type: DateType() },
    end_date: { type: DateType() },
    created_at: { type: Timestamp, default: true, options: 'DEFAULT NOW()' },
  },
} as const;

export type DBMedication = SchemaType<typeof medicationSchema>;

export type DBMedicationInsert = InsertSchemaType<typeof medicationSchema>;
