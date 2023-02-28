import { CreationOptional } from '@sql-tools/sequelize';
import { InferAttributes, InferCreationAttributes } from '@sql-tools/sequelize';
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from '@sql-tools/sequelize-typescript';
@Table({ tableName: 'person' })
export class Person extends Model<
  InferAttributes<Person>,
  InferCreationAttributes<Person>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.INTEGER)
  age: number;

  @Unique
  @Column(DataType.STRING)
  login: string;

  @Column(DataType.STRING)
  password: string;

  @Unique
  @Column(DataType.STRING)
  phoneNumber: string | number;
}
