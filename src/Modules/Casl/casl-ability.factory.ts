import {
  AbilityBuilder,
  InferSubjects,
  PureAbility,
  createMongoAbility,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../Database/local.database/models/User.model';
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Permit = 'permit',
  Delete = 'delete',
}
type Subjects = InferSubjects<typeof User> | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;
@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );
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
