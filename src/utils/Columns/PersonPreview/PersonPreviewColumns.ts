import { GridColDefExtend } from '../Agreements/AgreementColumns';
import { PersonPreview } from '../../../Modules/Database/Local.Database/models/PersonPreview';
import { Sequelize } from '@sql-tools/sequelize';
/**
 *
 * @returns person_id, FIO, birth_date
 */
export default function getPersonPreviewColumns(): GridColDefExtend<PersonPreview>[] {
  const columns: GridColDefExtend<PersonPreview>[] = [
    {
      type: 'number',
      modelName: 'PersonPreview',
      field: 'person_id',
      filterCol: 'PersonPreview.person_id',
      sortCol: 'PersonPreview.person_id',
    },
    {
      type: 'string',
      field: 'FIO',
      editable: false,
      modelName: 'PersonPreview',
      sortCol: {
        name: 'concat',
        args: [Sequelize.col('f'), ' ', Sequelize.col('i'), Sequelize.col('o')],
      },
      filterCol: {
        name: 'concat',
        args: [
          Sequelize.col('f'),
          ' ',
          Sequelize.col('i'),
          ' ',
          Sequelize.col('o'),
        ],
      },
    },
    {
      type: 'date',
      modelName: 'PersonPreview',
      field: 'birth_date',
      filterCol: 'PersonPreview.birth_date',
      sortCol: 'PersonPreview.birth_date',
    },
  ];
  return columns;
}
