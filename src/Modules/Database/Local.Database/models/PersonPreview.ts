import {
  InferAttributes,
  InferCreationAttributes,
  Model,
} from '@sql-tools/sequelize';
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
} from '@sql-tools/sequelize-typescript';

export class PersonPreview extends Model<
  InferAttributes<PersonPreview>,
  InferCreationAttributes<PersonPreview>
> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  person_id: number;

  @Column(DataType.STRING)
  f: string;

  @Column(DataType.STRING)
  i: string;

  @Column(DataType.STRING)
  o: string;

  @Column(DataType.DATE)
  birth_date: Date;
}
