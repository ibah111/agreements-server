import {
  BelongsToManyAttribute,
  CreateLiteralAssociation,
  HasManyAttribute,
} from '@sql-tools/association-literal';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from '@sql-tools/sequelize';
import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from '@sql-tools/sequelize-typescript';
import { ActionLog } from './ActionLog';
import { Role } from './Role.model';
import { User_Role } from './User_Role.model';
@Table({ tableName: 'Users' })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>,
  CreateLiteralAssociation<User>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  login: string;
  @BelongsToMany(() => Role, () => User_Role)
  Roles?: BelongsToManyAttribute<
    NonAttribute<Array<Role & { User_Role?: User_Role }>>,
    'id'
  >;
  @HasMany(() => ActionLog)
  Logs?: HasManyAttribute<NonAttribute<ActionLog[]>, 'user'>;
}
