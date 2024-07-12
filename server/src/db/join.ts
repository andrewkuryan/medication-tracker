import { Schema } from './Schema';

type JoinType = 'LEFT' | 'RIGHT' | 'INNER' | 'FULL'

export interface JoinQuery<L extends Schema, R extends Schema = Schema> {
    type: JoinType,
    target: R,
    sourceCol: keyof L['columns'],
    targetCol: keyof R['columns'],
}

export function leftJoin<L extends Schema, R extends Schema>(target: R, sourceCol: keyof L['columns'], targetCol: keyof R['columns']): JoinQuery<L, R> {
  return {
    type: 'LEFT', target, sourceCol, targetCol,
  };
}

export function formatJoin<S extends Schema>(source: S, join: JoinQuery<S>) {
  return `${join.type} JOIN ${join.target.tableName} ON ${source.tableName}.${String(join.sourceCol)} = ${join.target.tableName}.${String(join.targetCol)}`;
}
