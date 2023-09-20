import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.addColumn(
        'Payments',
        'id_schedule',
        {
          type: DataTypes.INTEGER,
        },
        {
          transaction: t,
        },
      ),
    ]),
  );
export const down: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.removeColumn('Payments', 'id_schedule', { transaction: t }),
    ]),
  );
