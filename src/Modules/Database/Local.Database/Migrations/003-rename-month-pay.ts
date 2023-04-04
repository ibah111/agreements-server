import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  await context.renameColumn('Agreements', 'month_pay', 'month_pay_day');
};
export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  await context.renameColumn('Agreements', 'month_pay_day', 'month_pay');
};
