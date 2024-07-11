import {
  ColumnType, DateType, Integer, Real, Schema, Serial, TextType, Varchar,
} from './Schema';

type IsNullable<T, N extends boolean> = N extends false ? T : (T | null);

type FieldType<C extends ColumnType> =
    C['name'] extends (typeof Serial)['name'] ? number :
    C['name'] extends ReturnType<typeof Integer>['name'] ? IsNullable<number, C['nullable']> :
    C['name'] extends ReturnType<typeof Real>['name'] ? IsNullable<number, C['nullable']> :
    C['name'] extends ReturnType<typeof Varchar>['name'] ? IsNullable<string, C['nullable']> :
    C['name'] extends ReturnType<typeof TextType>['name'] ? IsNullable<string, C['nullable']> :
    C['name'] extends ReturnType<typeof DateType>['name'] ? IsNullable<Date, C['nullable']> :
    never;

export type SchemaType<S extends Schema> = {
    [key in keyof S['columns']]: FieldType<S['columns'][key]['type']>
}
