import { GridColDef } from '@mui/x-data-grid-premium';
import { generateDefaults } from '../../addons';
const generateUsers = generateDefaults('local', 'User');

export default function usersCols(): GridColDef[] {
  return [
    {
      ...generateUsers('login'),
      type: 'string',
    },
  ];
}
