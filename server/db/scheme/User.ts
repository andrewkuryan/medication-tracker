import { Integer, Serial, Varchar } from '../Schema';
import { SchemaType } from '../SchemaType';

export const userSchema = {
  tableName: 'users',
  columns: {
    id: { type: Serial, options: 'PRIMARY KEY' },
    email: { type: Varchar(255) },
  },
};

export const userCredentialsSchema = {
  tableName: 'user_credentials',
  columns: {
    id: { type: Serial, options: 'PRIMARY KEY' },
    user_id: { type: Integer(), options: `REFERENCES ${userSchema.tableName} (id)` },
    salt: { type: Varchar(128) },
    verifier_hex: { type: Varchar(1024) },
  },
};

export const sessionSchema = {
  tableName: 'sessions',
  columns: {
    id: { type: Serial, options: 'PRIMARY KEY' },
    user_id: { type: Integer(), options: `REFERENCES ${userSchema.tableName} (id)` },
    k_hex: { type: Varchar(1024) },
    client_name: { type: Varchar(255) },
  },
};

export type DBUser = SchemaType<typeof userSchema>;
export type DBUserCredentials = SchemaType<typeof userCredentialsSchema>;
export type DBSession = SchemaType<typeof sessionSchema>;
