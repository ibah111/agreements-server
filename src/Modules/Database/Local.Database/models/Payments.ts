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
import {
  CreationOptional,
  InferAttributes,
  NonAttribute,
  ForeignKey as FK,
  InferCreationAttributes,
} from '@sql-tools/sequelize';
import { Agreement } from './Agreement';
import {
  BelongsToAttribute,
  CreateLiteralAssociation,
} from '@sql-tools/association-literal';

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
  @ForeignKey(() => Agreement)
  @Column(DataType.INTEGER)
  id_agreement: FK<number>;

  @BelongsTo(() => Agreement)
  Agreement?: BelongsToAttribute<NonAttribute<Agreement>>;

  @Column(DataType.DATE)
  pay_day: Date | null;

  @Column(DataType.NUMBER)
  sum_owe: number;

  @Column(DataType.BOOLEAN)
  status: boolean;
}
