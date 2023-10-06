import { Debt } from '@contact/models';
import {
  BelongsToAttribute,
  CreateLiteralAssociation,
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
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
import { Agreement } from './Agreement';
import { ScheduleType } from './ScheduleType';

@Table({
  tableName: 'ScheduleLinks',
  timestamps: false,
})
export class ScheduleLinks extends Model<
  InferAttributes<ScheduleLinks>,
  InferCreationAttributes<ScheduleLinks>,
  CreateLiteralAssociation<ScheduleLinks>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.INTEGER)
  @ForeignKey(() => Agreement)
  id_agreement: number;
  @Column(DataType.INTEGER)
  @ForeignKey(() => ScheduleType)
  schedule_type: number;
  @Column(DataType.INTEGER)
  id_debt: number | null;
  @Column(DataType.STRING)
  contract: string | null;

  @BelongsTo(() => Agreement)
  Agreement?: NonAttribute<Agreement>;

  Debt?: BelongsToAttribute<NonAttribute<Debt>>;
}
