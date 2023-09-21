import { GridFilterModel, GridSortModel } from '@mui/x-data-grid-premium';
import Filter from 'src/utils/Filter';
import Sort from 'src/utils/Sort';
import logCols from './LogsColumns';

export function getLogsUtils() {
  const columns = logCols();
  const utils = {
    getColumns: () => columns,
    getFilter: (modelName: string, filter?: GridFilterModel) =>
      Filter(columns, modelName, filter),
    getColumn: (name: string) =>
      columns.find((column) => column.field === name),
    getSort: (sort: GridSortModel) => Sort(columns, sort),
  };
  return utils;
}
