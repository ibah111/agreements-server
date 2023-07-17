import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  await context.renameColumn('Agreements', 'discount_sum', 'sum');
};
export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  await context.renameColumn('Agreements', 'sum', 'discount_sum');
};
