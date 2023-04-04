import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  await context.addColumn('Agreements', 'deletedAt', {
    type: DataTypes.DATE,
  });
};
export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  await context.removeColumn('Agreements', 'deletedAt');
};
