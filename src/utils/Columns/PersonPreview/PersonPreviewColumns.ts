import { Sequelize } from '@sql-tools/sequelize';
import { GridColDefAddon, generateDefaults } from '../addons';

const generatePreview = generateDefaults('local', 'PersonPreview');
export default function getPersonPreviewColumns(): GridColDefAddon[] {
  return [
    {
      ...generatePreview('person_id'),
      type: 'number',
    },
    {
      ...generatePreview('FIO'),
      type: 'string',
      editable: false,
      col: Sequelize.fn(
        'concat',
        Sequelize.col('f'),
        ' ',
        Sequelize.col('i'),
        ' ',
        Sequelize.col('o'),
      ),
    },
    {
      ...generatePreview('birth_date'),
      type: 'date',
      editable: false,
    },
  ];
}
