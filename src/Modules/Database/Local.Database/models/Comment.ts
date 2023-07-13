import {
  BelongsToAttribute,
  CreateLiteralAssociation,
} from '@sql-tools/association-literal';
import {
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  ForeignKey as FK,
  CreationOptional,
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
import { Agreement } from './Agreement';
import { User } from './User.model';

@Table({ tableName: 'comments' })
export class Comment extends Model<
  InferAttributes<Comment>,
  InferCreationAttributes<Comment>,
  CreateLiteralAssociation<Comment>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;

  @AllowNull(false)
  @ForeignKey(() => Agreement)
  @Column(DataType.INTEGER)
  id_agreement: FK<number>;

  @BelongsTo(() => Agreement)
  Agreement?: BelongsToAttribute<NonAttribute<Agreement>>;

  @Column(DataType.STRING)
  comment: string | null;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user: number;
  User?: BelongsToAttribute<NonAttribute<User>>;
}
