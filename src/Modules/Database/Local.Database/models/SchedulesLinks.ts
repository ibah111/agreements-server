import { Debt } from '@contact/models';
import {
  BelongsToAttribute,
  CreateLiteralAssociation,
} from '@sql-tools/association-literal';
import {
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
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

@Table({
  tableName: 'ScheduleLinks',
})
export class ScheduleLinks extends Model<
  InferAttributes<ScheduleLinks>,
  InferCreationAttributes<ScheduleLinks>,
  CreateLiteralAssociation<ScheduleLinks>
> {
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.INTEGER)
  @ForeignKey(() => Agreement)
  id_agreement: number;
  @Column(DataType.INTEGER)
  schedule_type: number;
  @Column(DataType.INTEGER)
  id_debt: number;

  @BelongsTo(() => Agreement)
  Agreement?: NonAttribute<Agreement>;

  Debt?: BelongsToAttribute<NonAttribute<Debt>>;
}
