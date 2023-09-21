import { ActionLog } from '../../../../Modules/Database/Local.Database/models/ActionLog';
import { GridColDefExtend } from '../../Agreements/AgreementColumns';

export default function logCols(): GridColDefExtend<ActionLog>[] {
  const columns: GridColDefExtend<ActionLog>[] = [
    {
      type: 'string',
      modelName: 'User',
      field: 'id',
      filterCol: 'User.id',
      sortCol: 'User.id',
    },
    {
      type: 'string',
      modelName: 'User',
      field: 'actionType',
      filterCol: 'User.actionType',
      sortCol: 'User.actionType',
    },
    {
      type: 'string',
      modelName: 'User',
      field: 'field',
      filterCol: 'User.field',
      sortCol: 'User.field',
    },
    {
      type: 'number',
      modelName: 'User',
      field: 'row_id',
      filterCol: 'User.row_id',
      sortCol: 'User.row_id',
    },
    {
      type: 'number',
      modelName: 'User',
      field: 'user',
      filterCol: 'User.user',
      sortCol: 'User.user',
    },
    {
      type: 'date',
      modelName: 'User',
      field: 'createdAt',
      filterCol: 'User.createdAt',
      sortCol: 'User.createdAt',
    },
    {
      type: 'date',
      modelName: 'User',
      field: 'updatedAt',
      filterCol: 'User.updatedAt',
      sortCol: 'User.updatedAt',
    },
  ];
  return columns;
}
