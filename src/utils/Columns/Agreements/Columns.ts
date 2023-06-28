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
      ...generateDefault('person_id'),
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
      model: 'Debt',
      col: 'r_portfolio_id',
      base: 'contact',
      type: 'number',
      field: 'portfolio',
    },
    {
      ...generateDefault('agreement_type'),
      type: 'number',
      editable: true,
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
      ...generateDefault('debt_sum'),
      editable: true,
      type: 'number',
    },
    {
      ...generateDefault('recalculation_sum'),
      editable: true,
      type: 'number',
    },
    {
      ...generateDefault('discount_sum'),
      editable: true,
      type: 'number',
    },
    {
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
      ...generateDefault('sum_before_agreement'),
      type: 'number',
      filterable: false,
    },
    {
      ...generateDefault('first_payment'),
      type: 'number',
      filterable: false,
    },
    {
      ...generateDefault('first_payment_date'),
      type: 'date',
      filterable: false,
    },
    {
      ...generateDefault('last_payment'),
      type: 'number',
      filterable: false,
    },
    {
      ...generateDefault('last_payment_date'),
      type: 'date',
      filterable: false,
    },
    {
      ...generateDefault('sum_after_agreement'),
      type: 'number',
      filterable: false,
    },
    {
      ...generateDefault('new_reg_doc'),
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
      ...generateDefault('collector'),
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
