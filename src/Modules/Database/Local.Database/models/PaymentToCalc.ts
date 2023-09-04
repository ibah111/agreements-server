import { CreateLiteralAssociation } from '@sql-tools/association-literal';
import { InferAttributes, InferCreationAttributes } from '@sql-tools/sequelize';
import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
import { Payments } from './Payments';

@Table({
  tableName: 'PaymentsToCalc',
  createdAt: false,
  deletedAt: false,
  updatedAt: false,
})
export class PaymentToCalc extends Model<
  InferAttributes<PaymentToCalc>,
  InferCreationAttributes<PaymentToCalc>,
  CreateLiteralAssociation<PaymentToCalc>
> {
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.INTEGER)
  @ForeignKey(() => Payments)
  id_payment: number;
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.INTEGER)
  id_debt_calc: number;
}
