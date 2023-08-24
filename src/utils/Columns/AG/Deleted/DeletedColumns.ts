import { GridColDefAddon, generateDefaults } from '../../addons';
const generateDels = generateDefaults('local', 'Agreements');
export default function deletedColumns(): GridColDefAddon[] {
  return [
    {
      ...generateDels('id'),
      type: 'number',
    },
    {
      ...generateDels('conclusion_date'),
      type: 'date',
      editable: true,
    },
    {
      ...generateDels('finish_date'),
      type: 'date',
      editable: true,
    },
    {
      ...generateDels('agreement_type'),
      type: 'number',
      editable: true,
    },
    {
      ...generateDels('payable_status'),
      type: 'boolean',
    },
    {
      ...generateDels('purpose'),
      editable: true,
      type: 'number',
    },
    {
      ...generateDels('statusAgreement'),
      editable: true,
      type: 'number',
    },
    {
      ...generateDels('full_req'),
      editable: true,
      type: 'number',
    },
    {
      ...generateDels('discount'),
      editable: true,
      type: 'number',
    },
    {
      ...generateDels('sum'),
      type: 'number',
      filterable: false,
    },
    {
      ...generateDels('month_pay_day'),
      type: 'number',
      filterable: false,
    },
    {
      ...generateDels('sum_before_agreement'),
      type: 'number',
      filterable: false,
    },
    {
      ...generateDels('first_payment'),
      type: 'number',
      filterable: false,
    },
    {
      ...generateDels('first_payment_date'),
      type: 'date',
      filterable: false,
    },
    {
      ...generateDels('last_payment'),
      type: 'number',
      filterable: false,
    },
    {
      ...generateDels('last_payment_date'),
      type: 'date',
      filterable: false,
    },
    {
      ...generateDels('sum_after_agreement'),
      type: 'number',
      filterable: false,
    },
    {
      ...generateDels('new_reg_doc'),
      type: 'number',
      editable: true,
    },
    {
      ...generateDels('receipt_dt'),
      type: 'date',
      editable: true,
    },
    {
      ...generateDels('actions_for_get'),
      editable: true,
    },
    {
      ...generateDels('collector_id'),
      type: 'number',
      editable: true,
    },
    {
      ...generateDels('task_link'),
      editable: true,
    },
  ];
}
