import {
  CreateLiteralAssociation,
  HasManyAttribute,
} from '@sql-tools/association-literal';
import {
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from '@sql-tools/sequelize';
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
import { Agreement } from './Agreement';

@Table({ tableName: 'statusAgreement' })
export class StatusAgreement extends Model<
  InferAttributes<StatusAgreement>,
  InferCreationAttributes<StatusAgreement>,
  CreateLiteralAssociation<StatusAgreement>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;
  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;
  @HasMany(() => Agreement)
  Agreements?: HasManyAttribute<NonAttribute<Agreement[]>, 'statusAgreement'>;
}
