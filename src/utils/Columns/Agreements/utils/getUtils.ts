import {
  GridColDef,
  GridFilterModel,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import Filter from 'src/utils/Filter';
import Sort from 'src/utils/Sort';
import { AddonData } from '../../addons';
import getColumns from '../Columns';
import { getAttributes } from './getAttributes';
export interface ResultColumn<T> extends AddonData {
  field: T;
  editable: boolean;
  type: GridColDef['type'];
}

export function getUtils() {
  const columns = getColumns();
  const utils = {
    generateFilter: (filter: GridFilterModel) => (model: string) =>
      Filter(
        filter,
        columns.filter((item) => item.model === model),
      ),
    getColumns: () => columns,
    getAttributes: (model: string) =>
      getAttributes(columns.filter((item) => item.model === model)),
    generateSort: (sort: GridSortModel) => (base: string) =>
      Sort(
        columns.filter((item) => item.base === base),
        sort,
      ),
    getColumn<T extends keyof Agreement>(name: T) {
      return columns.find(
        (column) => column.field === name,
      ) as unknown as ResultColumn<T>;
    },
  };
  return utils;
}
