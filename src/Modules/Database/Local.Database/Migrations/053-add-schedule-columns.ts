import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.addColumn(
        'ScheduleLinks',
        'name',
        {
          type: DataTypes.STRING,
        },
        { transaction: t },
      ),
      await context.addColumn(
        'ScheduleLinks',
        'document_number',
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
      await context.removeColumn('ScheduleLinks', 'name', { transaction: t }),
      await context.removeColumn('ScheduleLinks', 'document_number', {
        transaction: t,
      }),
    ]),
  );
