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
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
