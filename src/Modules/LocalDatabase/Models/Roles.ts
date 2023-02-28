import { CreationOptional } from '@sql-tools/sequelize';
import { InferAttributes, InferCreationAttributes } from '@sql-tools/sequelize';
import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
@Table({ tableName: 'Roles' })
export class Role extends Model<
  InferAttributes<Role>,
  InferCreationAttributes<Role>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  text: string;
}
