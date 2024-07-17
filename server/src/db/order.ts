import { Schema } from './Schema';

type OrderType = 'ASC' | 'DESC';
export type OrderExp<S extends Schema> = { columns: (keyof S['columns'])[], type: OrderType }

export function desc<S extends Schema>(columns: (keyof S['columns'])[]): OrderExp<S> {
  return { columns, type: 'DESC' };
}

export function formatOrderExp<S extends Schema>(expr: OrderExp<S>, schema: S) {
  const columns = expr.columns.map((column) => `${schema.tableName}.${String(column)}`).join(', ');
  return `ORDER BY ${columns} ${expr.type}`;
}
