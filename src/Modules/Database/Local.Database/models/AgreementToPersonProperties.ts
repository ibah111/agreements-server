import { CreateLiteralAssociation } from '@sql-tools/association-literal';
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
import { PersonProperty } from '@contact/models';

@Table({
  tableName: 'AgreementToProperties',
  createdAt: false,
  deletedAt: false,
  updatedAt: false,
})
export default class AgreementToPersonProperties extends Model<
  InferAttributes<AgreementToPersonProperties>,
  InferCreationAttributes<AgreementToPersonProperties>,
  CreateLiteralAssociation<AgreementToPersonProperties>
> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id_person_property: number;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => Agreement)
  id_agreement: number;

  @BelongsTo(() => Agreement)
  Agreement?: NonAttribute<Agreement>;

  PersonProperties?: NonAttribute<PersonProperty>;
}
