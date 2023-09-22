import { Sequelize } from '@sql-tools/sequelize';
import { Agreement } from '../../../Modules/Database/Local.Database/models/Agreement';
import { GridColDef, GridValidRowModel } from '@mui/x-data-grid-premium';
import { Literal } from '@sql-tools/sequelize/types/utils';

interface ColumnFunction {
  name: string;
  args: unknown[];
}

export type GridColDefExtend<T extends GridValidRowModel = any> = {
  modelName: string;
  filterCol: string | ColumnFunction | Literal;
  sortCol: string | ColumnFunction | Literal;
} & GridColDef<T>;

export default function getAgreementColumns(): GridColDefExtend<Agreement>[] {
  const columns: GridColDefExtend<Agreement>[] = [
    {
      field: 'sum_remains',
      type: 'number',
      modelName: 'Agreement',
      filterCol: Sequelize.literal(
        '(Agreement.sum - (SELECT SUM(sum_payments) FROM AgreementToDebtLink WHERE id_agreement = Agreement.id))',
      ),
      sortCol: Sequelize.literal(
        '(Agreement.sum - (SELECT SUM(sum_payments) FROM AgreementToDebtLink WHERE id_agreement = Agreement.id))',
      ),
    },
    {
      field: 'id',
      modelName: 'Agreement',
      type: 'number',
      filterCol: '',
      sortCol: '',
    },
    {
      field: 'conclusion_date',
      modelName: 'Agreement',
      type: 'date',
      filterCol: 'Agreement.conclusion_date',
      sortCol: 'Agreement.conclusion_date',
    },
    {
      field: 'finish_date',
      modelName: 'Agreement',
      type: 'date',
      filterCol: 'Agreement',
      sortCol: 'Agreement',
    },
    {
      field: 'purpose',
      type: 'number',
      modelName: 'Agreement',
      filterCol: 'Agreement.purpose',
      sortCol: 'Agreement.purpose',
    },
    {
      field: 'sum',
      type: 'number',
      modelName: 'Agreement',
      filterCol: 'Agreement.sum',
      sortCol: 'Agreement.sum',
    },
    {
      field: 'discount',
      type: 'number',
      modelName: 'Agreement',
      filterCol: 'Agreement.discount',
      sortCol: 'Agreement.discount',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'full_req',
      filterCol: 'Agreement.full_req',
      sortCol: 'Agreement.full_req',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'month_pay_day',
      filterCol: 'Agreement.month_pay_day',
      sortCol: 'Agreement.month_pay_day',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'reg_doc',
      filterCol: 'Agreement.reg_doc',
      sortCol: 'Agreement.reg_doc',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'registrator',
      filterCol: 'Agreement.registrator',
      sortCol: 'Agreement.registrator',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'archive',
      filterCol: 'Agreement.archive',
      sortCol: 'Agreement.archive',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'collector_id',
      filterCol: 'Agreement.collector_id',
      sortCol: 'Agreement.collector_id',
    },
    {
      type: 'string',
      modelName: 'Agreement',
      field: 'task_link',
      filterCol: 'Agreement.task_link',
      sortCol: 'Agreement.task_link',
    },
    {
      type: 'string',
      modelName: 'Agreement',
      field: 'task_link',
      filterCol: 'Agreement.task_link',
      sortCol: 'Agreement.task_link',
    },
    {
      type: 'string',
      modelName: 'Agreement',
      field: 'actions_for_get',
      filterCol: 'Agreement.actions_for_get',
      sortCol: 'Agreement.actions_for_get',
    },
    {
      type: 'string',
      modelName: 'Agreement',
      field: 'receipt_dt',
      filterCol: 'Agreement.receipt_dt',
      sortCol: 'Agreement.receipt_dt',
    },
    {
      type: 'string',
      modelName: 'Comments',
      field: 'comment',
      filterCol: 'Comments.comment',
      sortCol: 'Comments.comment',
    },
    {
      type: 'boolean',
      modelName: 'Agreement',
      field: 'payable_status',
      filterCol: 'Agreement.payable_status',
      sortCol: 'Agreement.payable_status',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'debt_count',
      filterCol: 'Agreement.debt_count',
      sortCol: 'Agreement.debt_count',
    },
    {
      type: 'string',
      modelName: 'Agreement',
      field: 'car',
      filterCol: 'Agreement.car',
      sortCol: 'Agreement.car',
    },
  ];
  return columns;
}
