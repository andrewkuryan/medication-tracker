import { PlainModelType } from './Model';
import { NullableObject, NullableValue } from './Parser';

type ErrorValue<V> =
    V extends PlainModelType ? (string | undefined) :
    // eslint-disable-next-line no-use-before-define
    V extends object ? ErrorsObject<V> : never
export type ErrorsObject<T> = { [K in keyof T]?: ErrorValue<T[K]> }

export type ValidatorConfig<T> = {
    [K in keyof T]: (parseResult: NullableValue<T[K]>) => ErrorValue<T[K]>
}

type Validator<T> = (model: NullableObject<T>) => ErrorsObject<T>

function isErrorValue<V>(
  value: string | undefined | ErrorsObject<V>,
): value is (string | undefined) {
  return value === undefined || typeof value === 'string';
}

function isErrorsObject<V>(value: string | undefined | ErrorsObject<V>): value is ErrorsObject<V> {
  return !isErrorValue(value);
}

export function validator<T>(config: ValidatorConfig<T>): Validator<T> {
  return (parserResult) => (Object.keys(parserResult) as (keyof T)[])
    .reduce((acc, key) => {
      const fieldResult = config[key](parserResult[key]);
      if (isErrorsObject<T[typeof key]>(fieldResult)) {
        return Object.keys(fieldResult).length > 0 ? { ...acc, [key]: fieldResult } : acc;
      }
      return fieldResult ? { ...acc, [key]: fieldResult } : acc;
    }, {} as ErrorsObject<T>);
}
