import {
  ColumnType, DateType, Integer, Real, Schema, Serial, TextType, Varchar, BooleanType, Timestamp,
} from './Schema';

type IsNullable<T, N extends boolean> = N extends false ? T : (T | null);

type BaseType<C extends ColumnType> =
    C['name'] extends (typeof Serial)['name'] ? number :
    C['name'] extends ReturnType<typeof Integer>['name'] ? number :
    C['name'] extends ReturnType<typeof Real>['name'] ? number :
    C['name'] extends ReturnType<typeof Varchar>['name'] ? string :
    C['name'] extends ReturnType<typeof TextType>['name'] ? string :
    C['name'] extends ReturnType<typeof DateType>['name'] ? string :
    C['name'] extends (typeof Timestamp)['name'] ? string :
    C['name'] extends ReturnType<typeof BooleanType>['name'] ? boolean :
    never;

export type FieldType<C extends ColumnType> = IsNullable<BaseType<C>, C['nullable']>

export type SchemaType<S extends Schema> = {
    [key in keyof S['columns']]: FieldType<S['columns'][key]['type']>
}

export type InsertSchemaType<S extends Schema> = {
    [key in keyof S['columns'] as S['columns'][key]['default'] extends true ? key : never]?: FieldType<S['columns'][key]['type']>
} & {
    [key in keyof S['columns'] as S['columns'][key]['default'] extends true ? never : key]: FieldType<S['columns'][key]['type']>
}
