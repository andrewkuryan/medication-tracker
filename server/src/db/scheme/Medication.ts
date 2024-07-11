import {
  DateType,
  Integer, Real, Serial, TextType, Varchar,
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
    total_count: { type: Integer(), options: 'DEFAULT 0', default: true },
    expiry_date: { type: DateType(true) },
  },
} as const;

export const medicationCourseSchema = {
  tableName: 'medication_courses',
  columns: {
    id: { type: Serial, options: 'PRIMARY KEY', default: true },
    medication_id: { type: Integer(), options: `REFERENCES ${medicationSchema.tableName} (id)` },
    frequency: { type: Real() },
    count: { type: Integer(), options: 'DEFAULT 0', default: true },
    destination_count: { type: Integer() },
    start_date: { type: DateType() },
    end_date: { type: DateType() },
  },
} as const;

export type DBMedication = SchemaType<typeof medicationSchema>;
export type DBMedicationCourse = SchemaType<typeof medicationCourseSchema>;

export type DBMedicationInsert = InsertSchemaType<typeof medicationSchema>;
export type DBMedicationCourseInsert = InsertSchemaType<typeof medicationCourseSchema>;
