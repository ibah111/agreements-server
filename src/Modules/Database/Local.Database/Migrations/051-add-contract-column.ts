import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.addColumn(
        'ScheduleLinks',
        'contract',
        {
          type: DataTypes.STRING,
        },
        { transaction: t },
      ),
    ]),
  );

export const down: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.removeColumn('ScheduleLinks', 'contract', {
        transaction: t,
      }),
    ]),
  );
