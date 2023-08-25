import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.addColumn(
        'Agreements',
        'debt_count',
        {
          type: DataTypes.INTEGER,
        },
        { transaction: t },
      ),
    ]),
  );
export const down: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.removeColumn('Agreements', 'debt_count', {
        transaction: t,
      }),
    ]),
  );
