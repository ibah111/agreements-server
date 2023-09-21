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
      modelName: 'PersonPreview',
      field: 'contract',
      filterCol: 'PersonPreview.contract',
      sortCol: 'PersonPreview.contract',
    },
    {
      type: 'number',
      modelName: 'PersonPreview',
      field: '',
      filterCol: 'PersonPreview.',
      sortCol: 'PersonPreview.',
    },
  ];
  return columns;
}
