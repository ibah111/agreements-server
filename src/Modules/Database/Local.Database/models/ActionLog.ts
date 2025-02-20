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
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
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
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;
  /**
   * ID строки
   */
  @AllowNull(false)
  @Column(DataType.INTEGER)
  row_id: FK<number>;
  /**
   * Тип действия
   */
  @AllowNull(false)
  @Column(DataType.INTEGER)
  actionType: Actions;
  /**
   * Поле которое изменили
   */
  @Column(DataType.STRING)
  field: string | null;
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
