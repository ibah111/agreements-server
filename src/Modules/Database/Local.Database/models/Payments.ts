import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
import {
  CreationOptional,
  InferAttributes,
  NonAttribute,
  ForeignKey as FK,
  InferCreationAttributes,
} from '@sql-tools/sequelize';
import {
  BelongsToAttribute,
  CreateLiteralAssociation,
  HasManyAttribute,
} from '@sql-tools/association-literal';
import { PaymentToCalc } from './PaymentToCalc';
import { ScheduleLinks } from './SchedulesLinks';

@Table({
  tableName: 'Payments',
  createdAt: false,
  updatedAt: false,
  timestamps: false,
})
export class Payments extends Model<
  InferAttributes<Payments>,
  InferCreationAttributes<Payments>,
  CreateLiteralAssociation<Payments>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;

  @AllowNull(false)
  @ForeignKey(() => ScheduleLinks)
  @Column(DataType.INTEGER)
  id_schedule: FK<number>;

  @BelongsTo(() => ScheduleLinks)
  ScheduleLinks: BelongsToAttribute<NonAttribute<ScheduleLinks>>;

  @Column(DataType.DATE)
  pay_day: Date | null;

  @Column(DataType.NUMBER)
  sum_owe: number;

  @Column(DataType.NUMBER)
  sum_left: number;

  @Column(DataType.BOOLEAN)
  status: boolean;

  @HasMany(() => PaymentToCalc)
  Calcs?: NonAttribute<HasManyAttribute<PaymentToCalc[], 'id_payment'>>;
}
