import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.addColumn('Agreements', 'deletedAt', {
    type: DataTypes.DATE,
  });
export const down: MigrationFn<QueryInterface> = ({ context }) =>
  context.removeColumn('Agreements', 'deletedAt');
