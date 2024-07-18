import { FormModel, isPlainModelType, PlainModelType } from './Model';

export type NullableValue<V> =
    V extends PlainModelType ? (V | undefined) :
    // eslint-disable-next-line no-use-before-define
    V extends object ? NullableObject<V> : never
export type NullableObject<T> = { [K in keyof T]: NullableValue<T[K]> }

type DefinedValue<V> =
    V extends PlainModelType ? V :
    // eslint-disable-next-line no-use-before-define
    V extends object ? DefinedObject<V> : never
type DefinedObject<T> = { [K in keyof T]: DefinedValue<T[K]> }

type Parser<T, M extends FormModel<T>> = (model: M) => NullableObject<T>

export type ParserConfig<T, M extends FormModel<T>> = {
    [K in keyof T]: (model: M[K]) => NullableValue<T[K]>
}

function isNullableValue<V>(value: V | undefined | NullableObject<V>): value is (V | undefined) {
  return value === undefined || isPlainModelType(value);
}

function isNullableObject<V>(value: V | undefined | NullableObject<V>): value is NullableObject<V> {
  return !isNullableValue(value);
}

function isDefinedValue<V>(value: NullableValue<V>): value is DefinedValue<V> {
  // eslint-disable-next-line no-use-before-define
  return isNullableObject(value) ? isDefinedObject(value) : value !== undefined;
}

export function isDefinedObject<T>(result: NullableObject<T>): result is DefinedObject<T> {
  return (Object.keys(result) as (keyof T)[]).reduce(
    (acc, key) => acc && isDefinedValue<T[typeof key]>(result[key]),
    true,
  );
}

export function parser<T, M extends FormModel<T>>(config: ParserConfig<T, M>): Parser<T, M> {
  return (model) => (Object.keys(config) as (keyof T)[])
    .reduce((acc, key) => ({ ...acc, [key]: config[key](model[key]) }), {} as NullableObject<T>);
}

export const intParser = (value: string) => parseInt(value, 10);
export const numberParser = (value: string) => parseFloat(value);
