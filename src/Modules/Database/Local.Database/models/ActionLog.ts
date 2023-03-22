import { CreationOptional, InferAttributes, Model } from '@sql-tools/sequelize';
import {
  AllowNull,
  Column,
  DataType,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';

@Table({ tableName: 'ActionLog' })
export class ActionLog extends Model<InferAttributes<ActionLog>> {
  /**id действия */
  @PrimaryKey
  @Column(DataType.NUMBER)
  id: CreationOptional<number>;

  /** Тип действия */
  @AllowNull(false)
  @Column(DataType.STRING)
  actionType: string;
  /** Имя пользователя совершившего действие */
  @AllowNull(false)
  @Column(DataType.STRING)
  user: string;
  /** Роль пользователя */
  @AllowNull(false)
  @Column(DataType.STRING)
  userRole: string;
}
