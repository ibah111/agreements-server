import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.addColumn(
        'Agreements',
        'preview_last_payment_date',
        {
          type: DataTypes.DATE,
        },
        { transaction: t },
      ),
      await context.addColumn(
        'Agreements',
        'preview_last_payment_sum',
        {
          type: DataTypes.MONEY,
        },
        { transaction: t },
      ),
    ]),
  );

export const down: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.removeColumn('Agreements', 'preview_last_payment_date', {
        transaction: t,
      }),
      await context.removeColumn('Agreements', 'preview_last_payment_sum', {
        transaction: t,
      }),
    ]),
  );
