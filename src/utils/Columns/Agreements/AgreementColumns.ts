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
      type: 'number',
      modelName: 'Agreement',
      field: 'id',
      filterCol: 'id',
      sortCol: 'id',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'person_id',
      filterCol: 'person_id',
      sortCol: 'person_id',
    },
    {
      type: 'date',
      modelName: 'Agreement',
      field: 'conclusion_date',
      filterCol: 'conclusion_date',
      sortCol: 'conclusion_date',
    },
    {
      modelName: 'Agreement',
      type: 'date',
      field: 'finish_date',
      filterCol: 'finish_date',
      sortCol: 'finish_date',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'purpose',
      filterCol: 'purpose',
      sortCol: 'purpose',
    },
    {
      type: 'number',
      field: 'sum',
      modelName: 'Agreement',
      filterCol: 'sum',
      sortCol: 'sum',
    },
    {
      field: 'discount',
      type: 'number',
      modelName: 'Agreement',
      filterCol: 'discount',
      sortCol: 'discount',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'full_req',
      filterCol: 'full_req',
      sortCol: 'full_req',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'month_pay_day',
      filterCol: 'month_pay_day',
      sortCol: 'month_pay_day',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'reg_doc',
      filterCol: 'reg_doc',
      sortCol: 'reg_doc',
    },
    {
      type: 'string',
      modelName: 'Agreement',
      field: 'registrator',
      filterCol: 'registrator',
      sortCol: 'registrator',
    },
    {
      type: 'string',
      modelName: 'Agreement',
      field: 'archive',
      filterCol: 'archive',
      sortCol: 'archive',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'collector_id',
      filterCol: 'collector_id',
      sortCol: 'collector_id',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'agreement_type',
      filterCol: 'agreement_type',
      sortCol: 'agreement_type',
    },
    {
      type: 'string',
      modelName: 'Agreement',
      field: 'task_link',
      filterCol: 'task_link',
      sortCol: 'task_link',
    },
    {
      type: 'string',
      modelName: 'Agreement',
      field: 'task_link',
      filterCol: 'task_link',
      sortCol: 'task_link',
    },
    {
      type: 'string',
      modelName: 'Agreement',
      field: 'actions_for_get',
      filterCol: 'actions_for_get',
      sortCol: 'actions_for_get',
    },
    {
      type: 'string',
      modelName: 'Agreement',
      field: 'receipt_dt',
      filterCol: 'receipt_dt',
      sortCol: 'receipt_dt',
    },
    {
      type: 'boolean',
      modelName: 'Agreement',
      field: 'payable_status',
      filterCol: 'payable_status',
      sortCol: 'payable_status',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'debt_count',
      filterCol: 'debt_count',
      sortCol: 'debt_count',
    },
    {
      type: 'string',
      modelName: 'Agreement',
      field: 'car',
      filterCol: 'car',
      sortCol: 'car',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'statusAgreement',
      filterCol: 'statusAgreement',
      sortCol: 'statusAgreement',
    },
    {
      type: 'date',
      modelName: 'Agreement',
      field: 'preview_last_payment_date',
      filterCol: 'preview_last_payment_date',
      sortCol: 'preview_last_payment_date',
    },
    {
      type: 'number',
      modelName: 'Agreement',
      field: 'preview_last_payment_sum',
      filterCol: 'preview_last_payment_sum',
      sortCol: 'preview_last_payment_sum',
    },
    /**
     * Отдель комментов
     */
    {
      type: 'string',
      modelName: 'Comments',
      field: 'comment',
      filterCol: 'comment',
      sortCol: 'comment',
    },
    /**
     * debtLinks
     */
    {
      type: 'string',
      modelName: 'DebtLinks',
      field: 'contract',
      filterCol: 'contract',
      sortCol: 'contract',
    },
    {
      type: 'number',
      modelName: 'DebtLinks',
      field: 'portfolio',
      filterCol: 'portfolio',
      sortCol: 'portfolio',
    },
    {
      type: 'number',
      modelName: 'DebtLinks',
      field: 'first_payment',
      filterCol: 'first_payment',
      sortCol: 'first_payment',
    },
    {
      type: 'date',
      modelName: 'DebtLinks',
      field: 'first_payment_date',
      filterCol: 'first_payment_date',
      sortCol: 'first_payment_date',
    },
    {
      type: 'number',
      modelName: 'DebtLinks',
      field: 'last_payment',
      filterCol: 'last_payment',
      sortCol: 'last_payment',
    },
    {
      type: 'date',
      modelName: 'DebtLinks',
      field: 'last_payment_date',
      filterCol: 'last_payment_date',
      sortCol: 'last_payment_date',
    },
    /**
     * PersonPreview
     */
    {
      type: 'number',
      modelName: 'PersonPreview',
      field: 'person_id',
      filterCol: 'person_id',
      sortCol: 'person_id',
    },
    {
      type: 'string',
      field: 'FIO',
      editable: false,
      modelName: 'PersonPreview',
      sortCol: {
        name: 'concat',
        args: [Sequelize.col('f'), ' ', Sequelize.col('i'), Sequelize.col('o')],
      },
      filterCol: {
        name: 'concat',
        args: [
          Sequelize.col('f'),
          ' ',
          Sequelize.col('i'),
          ' ',
          Sequelize.col('o'),
        ],
      },
    },
    {
      type: 'date',
      modelName: 'PersonPreview',
      field: 'birth_date',
      filterCol: 'birth_date',
      sortCol: 'birth_date',
    },
  ];
  return columns;
}
