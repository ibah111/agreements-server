import { GridColDefAddon, generateDefaults } from '../../addons';

const generateLogs = generateDefaults('local', 'ActionLog');
export default function logCols(): GridColDefAddon[] {
  return [
    {
      ...generateLogs('id'),
      type: 'id',
    },
    {
      ...generateLogs('actionType'),
      type: 'number',
    },
    {
      ...generateLogs('field'),
      type: 'string',
    },
    {
      ...generateLogs('row_id'),
      type: 'number',
    },
    {
      ...generateLogs('user'),
      type: 'number',
    },
    {
      ...generateLogs('createdAt'),
      type: 'date',
    },
    {
      ...generateLogs('updatedAt'),
      type: 'date',
    },
  ];
}
