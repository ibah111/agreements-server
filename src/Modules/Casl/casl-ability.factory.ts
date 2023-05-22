import {
  AbilityBuilder,
  InferSubjects,
  PureAbility,
  createMongoAbility,
  ExtractSubjectType,
} from '@casl/ability';
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
      can(
        [Action.Create, Action.Delete, Action.Read], // Разрешенные действия
        Agreement, // Что разрешено к просмотру
        // ['conclusion_date'], <--- разрешенное к взаимодействию поле
        // { -------условие "если дата заключения 18.05.2015 - разрешено к ред-у"
        //   conclusion_date: moment('18.05.2015', 'DD.MM.YYYY').toDate(),
        // },
      );
      can(
        [Action.Create, Action.Delete, Action.Read], // Разрешенные действия
        AgreementDebtsLink, // Что разрешено к просмотру
        // ['conclusion_date'], <--- разрешенное к взаимодействию поле
        // { -------условие "если дата заключения 18.05.2015 - разрешено к ред-у"
        //   conclusion_date: moment('18.05.2015', 'DD.MM.YYYY').toDate(),
        // },
      );
    }
    if (roles.includes('worker')) {
      can(
        [Action.Create, Action.Read], // Разрешенные действия
        Agreement, // Что разрешено к просмотру
        // ['conclusion_date'], <--- разрешенное к взаимодействию поле
        // { -------условие "если дата заключения 18.05.2015 - разрешено к ред-у"
        //   conclusion_date: moment('18.05.2015', 'DD.MM.YYYY').toDate(),
        // },
      );
      can([Action.Update, Action.Delete], Agreement, { user: user.id });
      can(
        [Action.Create, Action.Read, Action.Update, Action.Delete],
        AgreementDebtsLink,
        {
          user: user.id,
        },
      );
    }
    can(Action.Read, Agreement);
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
