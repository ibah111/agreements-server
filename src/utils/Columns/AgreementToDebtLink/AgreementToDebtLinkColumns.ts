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
      filterCol: 'DebtLinks.contract',
      sortCol: 'DebtLinks.contract',
    },
    {
      type: 'number',
      modelName: 'DebtLinks',
      field: 'portfolio',
      filterCol: 'DebtLinks.portfolio',
      sortCol: 'DebtLinks.portfolio',
    },
    {
      type: 'number',
      modelName: 'AgreementToDebtLinks',
      field: 'first_payment',
      filterCol: 'AgreementToDebtLinks.first_payment',
      sortCol: 'AgreementToDebtLinks.first_payment',
    },
    {
      type: 'date',
      modelName: 'AgreementToDebtLinks',
      field: 'first_payment_date',
      filterCol: 'AgreementToDebtLinks.first_payment_date',
      sortCol: 'AgreementToDebtLinks.first_payment_date',
    },
    {
      type: 'number',
      modelName: 'AgreementToDebtLinks',
      field: 'last_payment',
      filterCol: 'AgreementToDebtLinks.last_payment',
      sortCol: 'AgreementToDebtLinks.last_payment',
    },
    {
      type: 'date',
      modelName: 'AgreementToDebtLinks',
      field: 'first_payment_date',
      filterCol: 'AgreementToDebtLinks.first_payment_date',
      sortCol: 'AgreementToDebtLinks.first_payment_date',
    },
    {
      type: 'number',
      modelName: 'AgreementToDebtLinks',
      field: 'first_payment',
      filterCol: 'AgreementToDebtLinks.first_payment',
      sortCol: 'AgreementToDebtLinks.first_payment',
    },
  ];
  return columns;
}
