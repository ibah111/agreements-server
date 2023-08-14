import { GridFilterModel, GridSortModel } from '@mui/x-data-grid-premium';
import Filter from 'src/utils/Filter';
import Sort from 'src/utils/Sort';
import { getAttributes } from '../../getAttributes';
import getAgreementToDebtLinksColumns from '../AgreementToDebtLinkColumns';
import AgreementDebtsLink from '../../../../Modules/Database/Local.Database/models/AgreementDebtLink';
import { ResultColumn } from '../../addons';

export function getAgreementToDebtLinksUtils() {
  const columns = getAgreementToDebtLinksColumns();
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
    getColumn<T extends keyof AgreementDebtsLink>(name: T) {
      return columns.find(
        (column) => column.field === name,
      ) as unknown as ResultColumn<T>;
    },
  };
  return utils;
}
