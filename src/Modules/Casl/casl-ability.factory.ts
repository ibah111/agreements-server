import {
  AbilityBuilder,
  InferSubjects,
  PureAbility,
  createMongoAbility,
  ExtractSubjectType,
} from '@casl/ability';
import { Debt, DebtCalc, Portfolio } from '@contact/models';
import { Injectable } from '@nestjs/common';
import { Agreement } from '../Database/Local.Database/models/Agreement';
import AgreementDebtsLink from '../Database/Local.Database/models/AgreementDebtLink';
import { User } from '../Database/Local.Database/models/User.model';
import { User_Role } from '../Database/Local.Database/models/User_Role.model';
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Link = 'link',
}
type Subjects =
  | InferSubjects<
      | typeof User
      | typeof User_Role
      | typeof Agreement
      | typeof AgreementDebtsLink
      | typeof DebtCalc
      | typeof Portfolio
      | typeof Debt
    >
  | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;
@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    const roles = user.Roles?.map((item) => item.name) || [];
    if (roles.includes('admin')) {
      can(Action.Manage, 'all');
    }
    if (roles.includes('moderator')) {
      can([Action.Create, Action.Read, Action.Update], Agreement);
      can([Action.Create, Action.Delete, Action.Read], AgreementDebtsLink);
      can([Action.Read], DebtCalc);
      can([Action.Read], Portfolio);
    }
    if (roles.includes('worker')) {
      can([Action.Create, Action.Read], Agreement);
      can([Action.Update], Agreement, { user: user.id });
      can([Action.Create, Action.Read], AgreementDebtsLink, {
        user: user.id,
      });
      can([Action.Read], DebtCalc);
      can([Action.Read], Portfolio);
    }
    can(Action.Read, Agreement);
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
