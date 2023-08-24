import { GridColDefAddon, generateDefaults } from '../../addons';
const generateUsers = generateDefaults('local', 'User');
export default function usersCols(): GridColDefAddon[] {
  return [
    {
      ...generateUsers('login'),
      type: 'string',
    },
  ];
}
