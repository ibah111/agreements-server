import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.addColumn(
        'Payments',
        'sum_payed',
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
      await context.removeColumn('Payments', 'sum_payed', { transaction: t }),
    ]),
  );
