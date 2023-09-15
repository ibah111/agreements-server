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
import { ScheduleLinks } from './SchedulesLinks';

@Table({ tableName: 'ScheduleType' })
export class ScheduleType extends Model<
  InferAttributes<ScheduleType>,
  InferCreationAttributes<ScheduleType>,
  CreateLiteralAssociation<ScheduleType>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;
  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;
  @HasMany(() => ScheduleLinks)
  ScheduleLinks?: HasManyAttribute<
    NonAttribute<ScheduleLinks[]>,
    'schedule_type'
  >;
}
