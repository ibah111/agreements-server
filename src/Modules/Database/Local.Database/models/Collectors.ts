/**
 * Contact exception data
 * Таблица Данных не подцепляемых из контакта
 */
import { CreateLiteralAssociation } from '@sql-tools/association-literal';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from '@sql-tools/sequelize';
import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
@Table({ tableName: 'Collectors', paranoid: true })
export class Collectors extends Model<
  InferAttributes<Collectors>,
  InferCreationAttributes<Collectors>,
  CreateLiteralAssociation<Collectors>
> {
  /**
   * ID записи
   */
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.NUMBER)
  id: CreationOptional<number>;

  @Column(DataType.INTEGER)
  id_contact: number;

  @Column(DataType.STRING)
  fio: string;

  @Column(DataType.STRING)
  department_name: string;
}
