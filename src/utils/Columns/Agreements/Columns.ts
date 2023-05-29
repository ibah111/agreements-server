import { Person } from '@contact/models';
import { Sequelize } from '@sql-tools/sequelize';
import { generateDefaults, GridColDefAddon } from '../addons';
const generateDefault = generateDefaults('local', 'Agreement');
export default function getColumns(): GridColDefAddon[] {
  return [
    {
      ...generateDefault('id'),
      type: 'number',
    },
    {
      ...generateDefault('conclusion_date'),
      type: 'date',
      editable: true,
    },
    {
      ...generateDefault('finish_date'),
      type: 'date',
      editable: true,
    },
    {
      ...generateDefault('personId'), // parent_id = 221
      type: 'number',
    },
    {
      field: 'FIO',
      base: 'contact',
      col: Sequelize.fn(
        'concat',
        Sequelize.col('f'),
        ' ',
        Sequelize.col('i'),
        ' ',
        Sequelize.col('o'),
      ),
      model: 'Person',
      sortOrder: [Person],
    },

    {
      ...generateDefault('purpose'),
      editable: true,
      type: 'number',
    },
    {
      ...generateDefault('statusAgreement'),
      editable: true,
      type: 'number',
    },
    {
      ...generateDefault('court_sum'),
      editable: true,
      type: 'number',
    },
    {
      // заполняется
      ...generateDefault('debt_sum'),
      editable: true,
      type: 'number',
    },
    {
      // заполняется
      ...generateDefault('recalculation_sum'),
      editable: true,
      type: 'number',
    },
    {
      // заполняется
      ...generateDefault('discount_sum'),
      editable: true,
      type: 'number',
    },
    {
      // вычисляемое
      ...generateDefault('total_dis_sum'),
      type: 'number',
      filterable: false,
    },
    {
      ...generateDefault('month_pay_day'),
      type: 'number',
      filterable: false,
    },
    {
      ...generateDefault('sumBeforeAgr'),
      type: 'number',
      filterable: false,
    },
    {
      //todo высчитывается
      ...generateDefault('firstPayment'),
      type: 'number',
      filterable: false,
    },
    {
      //todo высчитывается
      ...generateDefault('firstPaymentDate'),
      type: 'date',
      filterable: false,
    },
    {
      ...generateDefault('lastPayment'),
      type: 'number',
      filterable: false,
    },
    {
      ...generateDefault('lastPaymentDate'),
      type: 'date',
      filterable: false,
    },
    {
      ...generateDefault('sumAfterAgr'),
      type: 'number',
      filterable: false,
    },
    {
      ...generateDefault('new_regDoc'),
      type: 'number',
      editable: true,
    },
    {
      ...generateDefault('receipt_dt'),
      type: 'date',
      editable: true,
    },
    {
      ...generateDefault('actions_for_get'),
      editable: true,
    },
    {
      ...generateDefault('comment'),
      editable: true,
    },

    {
      ...generateDefault('task_link'),
      editable: true,
    },
  ];
}
