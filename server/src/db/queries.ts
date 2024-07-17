import { escapeLiteral } from 'pg';

import { InsertSchemaType, SchemaType } from './SchemaType';
import { Column, ColumnType, Schema } from './Schema';
import { JoinQuery, formatJoin } from './join';
import { formatWhereQuery, WhereExp } from './where';
import { formatOrderExp, OrderExp } from './order';

function formatColumnType(columnType: ColumnType): string {
  switch (columnType.name) {
    case 'VARCHAR':
      return `VARCHAR(${columnType.length})`;
    default:
      return columnType.name;
  }
}

function createColumnQuery(name: string, column: Column<boolean>) {
  return `${name} ${formatColumnType(column.type)}${('options' in column && column.options) ? ` ${column.options}` : ''}`;
}

export function createTableQuery(schema: Schema) {
  const columns = `${Object.entries(schema.columns).map(([name, column]) => createColumnQuery(name, column)).join(', ')}`;
  return `CREATE TABLE ${schema.tableName} (${columns})`;
}

export function dropTableQuery(schema: Schema) {
  return `DROP TABLE ${schema.tableName}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeValue(value: any) {
  return value === null ? 'NULL' : escapeLiteral(`${value}`);
}

export function insertQuery<S extends Schema>(schema: S, data: InsertSchemaType<S>) {
  const columnNames = Object.keys(data).join(', ');
  const columnValues = Object.values(data).map(serializeValue).join(', ');
  return `INSERT INTO ${schema.tableName} (${columnNames}) VALUES (${columnValues}) RETURNING *`;
}

export function updateQuery<S extends Schema>(
  schema: S,
  data: Partial<SchemaType<S>>,
  where?: WhereExp<S>,
) {
  const columns = Object.entries(data)
    .filter((entry) => entry[1] !== undefined)
    .map(([key, value]) => `${key} = ${serializeValue(value)}`).join(', ');
  const whereString = where ? formatWhereQuery(where, schema) : '';
  return `UPDATE ${schema.tableName} SET ${columns}${whereString ? ` ${whereString}` : ''} RETURNING *`;
}

interface SelectOptions<S extends Schema> {
    where?: WhereExp<S>,
    join?: JoinQuery<S>[],
    orderBy?: OrderExp<S>
}

export function selectQuery<S extends Schema>(schema: S, options?: SelectOptions<S>) {
  const joinString = options?.join ? options.join.map((it) => formatJoin(schema, it)).join(' ') : '';
  const whereString = options?.where ? formatWhereQuery(options.where, schema) : '';
  const orderString = options?.orderBy ? formatOrderExp(options.orderBy, schema) : '';
  return `SELECT * FROM ${schema.tableName}${
    joinString ? ` ${joinString}` : ''}${
    whereString ? ` ${whereString}` : ''}${
    orderString ? `${orderString}` : ''}`;
}
