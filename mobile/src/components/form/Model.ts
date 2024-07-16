export type FormModel<T> = {
    [K in keyof T]: unknown
}

type BaseModelType = string | number | boolean | Date
export type PlainModelType = BaseModelType | (BaseModelType | null)

function isBaseModelType(value: unknown): value is BaseModelType {
  return typeof value === 'string'
        || typeof value === 'number'
        || typeof value === 'boolean'
        || value instanceof Date;
}

export function isPlainModelType(value: unknown): value is PlainModelType {
  return value === null || isBaseModelType(value);
}
