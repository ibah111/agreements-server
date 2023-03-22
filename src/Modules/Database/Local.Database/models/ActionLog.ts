import {
  BelongsToAttribute,
  CreateLiteralAssociation,
} from '@sql-tools/association-literal';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  ForeignKey as FK,
} from '@sql-tools/sequelize';
import {
  AllowNull,
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

export enum Actions {
  CREATE = 1,
  UPDATE = 2,
  DELETE = 3,
}
@Table({ tableName: 'ActionLogs' })
export class ActionLog extends Model<
  InferAttributes<ActionLog>,
  InferCreationAttributes<ActionLog>,
  CreateLiteralAssociation<ActionLog>
> {
  /**
   * ID действия
   */
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;
  /**
   * ID строки
   */
  @ForeignKey(() => Agreement)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  row_id: FK<number>;
  @BelongsTo(() => Agreement)
  Agreement?: BelongsToAttribute<NonAttribute<Agreement>>;
  /**
   * Тип действия
   */
  @AllowNull(false)
  @Column(DataType.INTEGER)
  actionType: Actions;
  /**
   * Поле которое изменили
   */
  @AllowNull(false)
  @Column(DataType.STRING)
  field: string;
  /**
   * Старое значение
   */
  @Column(DataType.STRING)
  old_value: string | null;
  /**
   * Новое значение
   */
  @Column(DataType.STRING)
  new_value: string | null;
  /**
   * Имя пользователя совершившего действие
   */
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user: number;
  User?: BelongsToAttribute<NonAttribute<User>>;
}
