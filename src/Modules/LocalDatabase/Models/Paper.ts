import { CreationOptional } from '@sql-tools/sequelize';
import { InferAttributes, InferCreationAttributes } from '@sql-tools/sequelize';
import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from '@sql-tools/sequelize-typescript';
@Table({ tableName: 'Paper' })
export class Paper extends Model<
  InferAttributes<Paper>,
  InferCreationAttributes<Paper>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.INTEGER)
  datePost: number;
}
