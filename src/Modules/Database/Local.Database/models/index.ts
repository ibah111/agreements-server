import { AgrGetAllDto } from 'src/Pages/Agreements/Agr.dto';
import { ActionLog } from './ActionLog';
import { Agreement } from './Agreement';
import AgreementDebtsLink from './AgreementDebtLink';
import { PurposeType } from './PurposeType';
import { RegDocType } from './RegDocType';
import { Role } from './Role.model';
import { User } from './User.model';
import { User_Role } from './User_Role.model';

export const models = [
  User,
  Role,
  User_Role,
  Agreement,
  PurposeType,
  ActionLog,
  AgreementDebtsLink,
  AgrGetAllDto,
  RegDocType,
];
