import {
  AbilityBuilder,
  InferSubjects,
  PureAbility,
  createMongoAbility,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Agreement } from '../Database/Local.Database/models/Agreement';
import { User } from '../Database/Local.Database/models/User.model';
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Permit = 'permit',
  Delete = 'delete',
}
type Subjects = InferSubjects<typeof User | typeof Agreement> | 'all';
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
    }
    if (roles.includes('User')) {
      can(Action.Read, Agreement);
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
