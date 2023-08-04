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

@Table({
  tableName: 'person_preview',
  createdAt: false,
  updatedAt: false,
  timestamps: false,
})
export class PersonPreview extends Model<
  InferAttributes<PersonPreview>,
  InferCreationAttributes<PersonPreview>,
  CreateLiteralAssociation<PersonPreview>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  person_id: number;
  @AllowNull(false)
  @Column(DataType.STRING)
  f: string;
  @Column(DataType.STRING)
  i: string | null;
  @Column(DataType.STRING)
  o: string | null;
  @Column(DataType.DATE)
  birth_date: Date | null;
  @HasMany(() => Agreement)
  Agreements?: HasManyAttribute<NonAttribute<Agreement[]>, 'person_id'>;
}
