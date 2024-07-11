import {
  DateType,
  Integer, Real, Serial, TextType, Varchar,
} from '../Schema';
import { SchemaType } from '../SchemaType';
import { userSchema } from './User';

export const medicationSchema = {
  tableName: 'medications',
  columns: {
    id: { type: Serial, options: 'PRIMARY KEY' },
    user_id: { type: Integer(), options: `REFERENCES ${userSchema.tableName} (id)` },
    name: { type: Varchar(255, false) },
    description: { type: TextType(true) },
    total_count: { type: Integer(), options: 'DEFAULT 0' },
    expiry_date: { type: DateType(true) },
  },
};

export const medicationCourseSchema = {
  tableName: 'medication_courses',
  columns: {
    id: { type: Serial, options: 'PRIMARY KEY' },
    medication_id: { type: Integer(), options: `REFERENCES ${medicationSchema.tableName} (id)` },
    frequency: { type: Real() },
    count: { type: Integer(), options: 'DEFAULT 0' },
    destination_count: { type: Integer() },
    start_date: { type: DateType() },
    end_date: { type: DateType() },
  },
};

export type DBMedication = SchemaType<typeof medicationSchema>;
export type DBMedicationCourse = SchemaType<typeof medicationCourseSchema>;
