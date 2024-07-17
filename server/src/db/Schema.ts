export const Serial = { name: 'SERIAL', nullable: false } as const;
export const Integer = <N extends boolean = false>(nullable?: N) => ({
  name: 'INTEGER',
  nullable: nullable ?? false,
}) as const;
export const Real = <N extends boolean = false>(nullable?: N) => ({ name: 'REAL', nullable: nullable ?? false }) as const;
export const Varchar = <N extends boolean = false>(length: number, nullable?: N) => ({
  name: 'VARCHAR',
  length,
  nullable: nullable ?? false,
}) as const;
export const TextType = <N extends boolean = false>(nullable?: N) => ({
  name: 'TEXT',
  nullable: nullable ?? false,
}) as const;
export const DateType = <N extends boolean = false>(nullable?: N) => ({
  name: 'DATE',
  nullable: nullable ?? false,
}) as const;
export const Timestamp = { name: 'TIMESTAMP', nullable: false } as const;
export const BooleanType = <N extends boolean = false>(nullable?: N) => ({
  name: 'BOOLEAN',
  nullable: nullable ?? false,
}) as const;

export type ColumnType = typeof Serial |
    ReturnType<typeof Integer> |
    ReturnType<typeof Real> |
    ReturnType<typeof Varchar> |
    ReturnType<typeof TextType> |
    ReturnType<typeof DateType> |
    typeof Timestamp |
    ReturnType<typeof BooleanType>;

export interface Column<D extends boolean> {
    type: ColumnType,
    options?: string,
    default?: D,
}

export interface Schema {
    tableName: string;
    columns: { [key: string]: Column<boolean> }
}
