import { GridFilterModel, GridSortModel } from '@mui/x-data-grid-premium';
import Filter from 'src/utils/Filter';
import getAgreementColumns from '../AgreementColumns';
import Sort from '../../../Sort';

export function getAgreementUtils() {
  const columns = getAgreementColumns();
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
