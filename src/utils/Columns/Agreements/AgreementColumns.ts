import { generateDefaults, GridColDefAddon } from '../addons';
const generateDefault = generateDefaults('local', 'Agreement');
const generatePreview = generateDefaults('local', 'PersonPreview');
export default function getAgreementColumns(): GridColDefAddon[] {
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
      ...generateDefault('agreement_type'),
      type: 'number',
      editable: true,
    },
    {
      ...generateDefault('payable_status'),
      type: 'boolean',
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
      ...generateDefault('full_req'),
      editable: true,
      type: 'number',
    },
    {
      ...generateDefault('discount'),
      editable: true,
      type: 'number',
    },
    {
      ...generateDefault('sum'),
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
      ...generatePreview('first_payment_date'),
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
      ...generateDefault('collector_id'),
      type: 'number',
      editable: true,
    },
    {
      ...generateDefault('task_link'),
      editable: true,
    },
  ];
}
