import { GridColDefExtend } from '../Agreements/AgreementColumns';
import { PersonPreview } from '../../../Modules/Database/Local.Database/models/PersonPreview';
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
      type: 'number',
      modelName: 'PersonPreview',
      field: 'FIO',
      filterCol: 'PersonPreview.FIO',
      sortCol: 'PersonPreview.FIO',
    },
    {
      type: 'number',
      modelName: 'PersonPreview',
      field: 'birth_date',
      filterCol: 'PersonPreview.birth_date',
      sortCol: 'PersonPreview.birth_date',
    },
  ];
  return columns;
}
