import {
  BooleanType, Integer, Serial, Varchar,
} from '../Schema';
import { InsertSchemaType, SchemaType } from '../SchemaType';

export const userSchema = {
  tableName: 'users',
  columns: {
    id: { type: Serial, options: 'PRIMARY KEY', default: true },
    email: { type: Varchar(255), options: 'UNIQUE' },
  },
} as const;

export const userCredentialsSchema = {
  tableName: 'user_credentials',
  columns: {
    id: { type: Serial, options: 'PRIMARY KEY', default: true },
    user_id: { type: Integer(), options: `UNIQUE REFERENCES ${userSchema.tableName} (id)` },
    salt: { type: Varchar(128) },
    verifier_hex: { type: Varchar(1024) },
  },
} as const;

export const sessionSchema = {
  tableName: 'sessions',
  columns: {
    id: { type: Serial, options: 'PRIMARY KEY', default: true },
    user_id: { type: Integer(), options: `REFERENCES ${userSchema.tableName} (id)` },
    k_hex: { type: Varchar(1024) },
    client_name: { type: Varchar(255) },
    verified: { type: BooleanType(), options: 'DEFAULT FALSE', default: true },
  },
} as const;

export type DBUser = SchemaType<typeof userSchema>;
export type DBUserCredentials = SchemaType<typeof userCredentialsSchema>;
export type DBSession = SchemaType<typeof sessionSchema>;

export type DBUserInsert = InsertSchemaType<typeof userSchema>;
export type DBUserCredentialsInsert = InsertSchemaType<typeof userCredentialsSchema>;
export type DBSessionInsert = InsertSchemaType<typeof sessionSchema>;
