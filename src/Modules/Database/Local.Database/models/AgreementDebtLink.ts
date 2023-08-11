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
  PrimaryKey,
  Model,
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Table,
  BelongsTo,
} from '@sql-tools/sequelize-typescript';
import { Agreement } from './Agreement';

export interface PreviewDebt {
  contract: string | null;
  payable_status: boolean | null;
  before_agreement: number | null;
  first_payment: number | null;
  last_payment: number | null;
  first_payment_date: Date | null;
  last_payment_date: Date | null;
  sum_payments: number | null;
  portfolio: number | null;
  status: number | null;
}

@Table({
  tableName: 'AgreementToDebtLink',
  createdAt: false,
  deletedAt: false,
  updatedAt: false,
})
export default class AgreementDebtsLink
  extends Model<
    InferAttributes<AgreementDebtsLink>,
    InferCreationAttributes<AgreementDebtsLink>,
    CreateLiteralAssociation<AgreementDebtsLink>
  >
  implements PreviewDebt
{
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.INTEGER)
  id_debt: number;
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.INTEGER)
  @ForeignKey(() => Agreement)
  id_agreement: number;
  @Column(DataType.STRING)
  contract: string | null;
  @Column(DataType.BOOLEAN)
  payable_status: boolean | null;
  before_agreement: number | null;
  @Column(DataType.DECIMAL(19, 4))
  first_payment: number | null;
  @Column(DataType.DECIMAL(19, 4))
  last_payment: number | null;
  @Column(DataType.DATE)
  first_payment_date: Date | null;
  @Column(DataType.DATE)
  last_payment_date: Date | null;
  @Column(DataType.DECIMAL(19, 4))
  sum_payments: number | null;
  @Column(DataType.INTEGER)
  portfolio: number | null;
  @Column(DataType.INTEGER)
  status: number | null;
  @Column(DataType.INTEGER)
  error: number | null;
  @BelongsTo(() => Agreement)
  Agreement?: NonAttribute<Agreement>;

  Debt?: BelongsToAttribute<NonAttribute<Debt>>;
}
