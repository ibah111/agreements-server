import { GridColDefAddon } from './Columns/addons';
export default function getFieldHandler(columnModel: GridColDefAddon[]) {
  return (name: string) => columnModel.find((column) => column.field === name);
}
