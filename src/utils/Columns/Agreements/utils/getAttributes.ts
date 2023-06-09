import { FindAttributeOptions } from '@sql-tools/sequelize';
import { GridColDefAddon } from '../../addons';
export function getAttributes(columns: GridColDefAddon[]) {
  const result: string[] = [];
  for (const column of columns) {
    result.push(column.col as string);
  }
  return result as FindAttributeOptions;
}
