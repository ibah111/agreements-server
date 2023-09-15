import { ActionLog } from './ActionLog';
import { Agreement } from './Agreement';
import AgreementDebtsLink from './AgreementDebtLink';
import AgreementToPersonProperties from './AgreementToPersonProperties';
import { TypeAgreement } from './AgreementType';
import { Comment } from './Comment';
import { PaymentToCalc } from './PaymentToCalc';
import { Payments } from './Payments';
import { PersonPreview } from './PersonPreview';
import { PurposeType } from './PurposeType';
import { RegDocType } from './RegDocType';
import { Role } from './Role.model';
import { ScheduleLinks } from './SchedulesLinks';
import { StatusAgreement } from './StatusAgreement';
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
  RegDocType,
  StatusAgreement,
  TypeAgreement,
  Comment,
  AgreementToPersonProperties,
  PersonPreview,
  Payments,
  PaymentToCalc,
  ScheduleLinks,
];
