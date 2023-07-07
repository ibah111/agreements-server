import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';
export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  context.addColumn('Agreements', 'collector_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
export const down: MigrationFn<QueryInterface> = async ({ context }) =>
  context.removeColumn('Agreements', 'collector_id');
