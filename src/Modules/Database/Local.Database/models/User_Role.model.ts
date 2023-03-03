import {
  BelongsToAttribute,
  CreateLiteralAssociation,
} from '@sql-tools/association-literal';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey as FK,
  NonAttribute,
} from '@sql-tools/sequelize';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
import { Role } from './Role.model';
import { User } from './User.model';
@Table({ tableName: 'Users_Roles' })
export class User_Role extends Model<
  InferAttributes<User_Role>,
  InferCreationAttributes<User_Role>,
  CreateLiteralAssociation<User_Role>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id: FK<number>;
  @BelongsTo(() => User)
  User?: BelongsToAttribute<NonAttribute<User>>;
  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  role_id: FK<number>;
  @BelongsTo(() => Role)
  Role?: BelongsToAttribute<NonAttribute<Role>>;
}
