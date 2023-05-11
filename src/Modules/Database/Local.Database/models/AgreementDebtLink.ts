import { Debt } from '@contact/models';
import { CreateLiteralAssociation } from '@sql-tools/association-literal';
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

@Table({
  tableName: 'AgreementToDebtLink',
  createdAt: false,
  deletedAt: false,
  updatedAt: false,
})
export default class AgreementDebtsLink extends Model<
  InferAttributes<AgreementDebtsLink>,
  InferCreationAttributes<AgreementDebtsLink>,
  CreateLiteralAssociation<AgreementDebtsLink>
> {
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.INTEGER)
  id_debt: number;
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.INTEGER)
  @ForeignKey(() => Agreement)
  id_agreement: number;

  @BelongsTo(() => Agreement)
  Agreement?: NonAttribute<Agreement>;

  Debt?: NonAttribute<Debt>;
}
