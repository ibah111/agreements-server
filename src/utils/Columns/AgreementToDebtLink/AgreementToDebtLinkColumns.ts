import AgreementDebtsLink from '../../../Modules/Database/Local.Database/models/AgreementDebtLink';
import { GridColDefExtend } from '../Agreements/AgreementColumns';
/**
 *
 * @returns contract, portfolio
 */
export default function getAgreementToDebtLinksColumns(): GridColDefExtend<AgreementDebtsLink>[] {
  const columns: GridColDefExtend<AgreementDebtsLink>[] = [
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
  ];
  return columns;
}
