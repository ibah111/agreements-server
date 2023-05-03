import { CreateLiteralAssociation } from '@sql-tools/association-literal';
import { InferAttributes, InferCreationAttributes } from '@sql-tools/sequelize';
import { PrimaryKey, Model, AllowNull } from '@sql-tools/sequelize-typescript';

export default class AgreementDebtsLink extends Model<
  InferAttributes<AgreementDebtsLink>,
  InferCreationAttributes<AgreementDebtsLink>,
  CreateLiteralAssociation<AgreementDebtsLink>
> {
  @AllowNull(false)
  @PrimaryKey
  id_debt: number;
  @AllowNull(false)
  @PrimaryKey
  id_agreement: number;
}
