import { User } from '../../../../Modules/Database/Local.Database/models/User.model';
import { GridColDefExtend } from '../../Agreements/AgreementColumns';
export default function usersCols(): GridColDefExtend<User>[] {
  return [
    {
      type: 'string',
      modelName: 'User',
      field: 'login',
      filterCol: 'User.login',
      sortCol: 'User.login',
    },
  ];
}
