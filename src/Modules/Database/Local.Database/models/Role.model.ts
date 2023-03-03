import { BelongsToManyAttribute } from '@sql-tools/association-literal';
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
  Model,
  PrimaryKey,
  Table,
  Unique,
} from '@sql-tools/sequelize-typescript';
import { User } from './User.model';
import { User_Role } from './User_Role.model';
@Table({ tableName: 'Roles' })
export class Role extends Model<
  InferAttributes<Role>,
  InferCreationAttributes<Role>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;
  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;
  @BelongsToMany(() => User, () => User_Role)
  Users?: BelongsToManyAttribute<
    NonAttribute<Array<User & { User_Role: User_Role }>>
  >;
}
