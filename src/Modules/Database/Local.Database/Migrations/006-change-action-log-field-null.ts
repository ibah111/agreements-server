import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.changeColumn('ActionLogs', 'field', {
    type: DataTypes.STRING,
    allowNull: true,
  });
export const down: MigrationFn<QueryInterface> = ({ context }) =>
  context.changeColumn('ActionLogs', 'field', {
    type: DataTypes.STRING,
    allowNull: false,
  });
