import { GridColDefAddon, generateDefaults } from '../addons';
const generateLink = generateDefaults('local', 'AgreementToDebtLinks');
export default function getAgreementToDebtLinksColumns(): GridColDefAddon[] {
  return [
    {
      ...generateLink('contract'),
      type: 'string',
      editable: false,
    },
    {
      ...generateLink('portfolio'),
      type: 'number',
    },
  ];
}
