import { escapeLiteral } from 'pg';

import { Schema } from './Schema';
import { FieldType } from './SchemaType';

type ComparisonOp = '=';
type LogicalOp = 'AND';

interface WhereCondition<S extends Schema, K extends keyof S['columns']> {
    column: K,
    operator: ComparisonOp,
    value: FieldType<S['columns'][K]['type']>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WhereExp<S extends Schema, K extends keyof S['columns'] = any> =
    WhereCondition<S, K>
    | { exp1: WhereExp<S>, operator: LogicalOp, exp2: WhereExp<S> };

export function and<S extends Schema, K1 extends keyof S['columns'], K2 extends keyof S['columns']>(exp1: WhereExp<S, K1>, exp2: WhereExp<S, K2>): WhereExp<S> {
  return { exp1, operator: 'AND', exp2 };
}

export function eq<S extends Schema, K extends keyof S['columns']>(column: K, value: FieldType<S['columns'][K]['type']>): WhereCondition<S, K> {
  return { column, operator: '=', value };
}

function formatWhereCondition<S extends Schema, K extends keyof S['columns']>(cond: WhereCondition<S, K>, schema: S, schemaAlias?: string) {
  return `${schemaAlias ?? schema.tableName}.${String(cond.column)} ${cond.operator} ${escapeLiteral(`${cond.value}`)}`;
}

function formatWhereExp<S extends Schema>(
  exp: WhereExp<S>,
  schema: S,
  schemaAlias?: string,
): string {
  if ('exp1' in exp) {
    return `${formatWhereExp(exp.exp1, schema, schemaAlias)} ${exp.operator} ${formatWhereExp(exp.exp2, schema, schemaAlias)}`;
  }
  return formatWhereCondition(exp, schema, schemaAlias);
}

export function formatWhereQuery<S extends Schema>(
  exp: WhereExp<S>,
  schema: S,
  schemaAlias?: string,
) {
  return `WHERE ${formatWhereExp(exp, schema, schemaAlias)}`;
}
