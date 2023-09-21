import { GridFilterModel, GridSortModel } from '@mui/x-data-grid-premium';
import Filter from 'src/utils/Filter';
import Sort from 'src/utils/Sort';
import getPersonPreviewColumns from '../PersonPreviewColumns';

export function getPersonPreviewUtils() {
  const columns = getPersonPreviewColumns();
  const utils = {
    getColumns: () => columns,
    getFilter: (modelName: string, filter?: GridFilterModel) =>
      Filter(columns, modelName, filter),
    getColumn: (name: string) =>
      columns.find((column) => column.field === name),
    getSort: (sort?: GridSortModel) => Sort(columns, sort),
  };
  return utils;
}
