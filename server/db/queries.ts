import { Column, ColumnType, Schema } from './Schema';

function formatColumnType(columnType: ColumnType): string {
  switch (columnType.name) {
    case 'VARCHAR':
      return `VARCHAR(${columnType.length})`;
    default:
      return columnType.name;
  }
}

function createColumnQuery(name: string, column: Column) {
  return `${name} ${formatColumnType(column.type)}${('options' in column && column.options) ? ` ${column.options}` : ''}`;
}

export function createTableQuery(schema: Schema) {
  const columns = `${Object.entries(schema.columns).map(([name, column]) => createColumnQuery(name, column)).join(', ')}`;
  return `CREATE TABLE ${schema.tableName} (${columns})`;
}

export function dropTableQuery(schema: Schema) {
  return `DROP TABLE ${schema.tableName}`;
}
