import { Model, Table } from '@sql-tools/sequelize-typescript';
@Table({ tableName: 'Users' })
export class User extends Model {}
