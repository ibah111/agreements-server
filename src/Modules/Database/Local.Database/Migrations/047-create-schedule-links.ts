import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.createTable(
        'ScheduleLinks',
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
          },
          id_agreement: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
          },
          schedule_type: {
            type: DataTypes.INTEGER,
            references: {
              model: 'ScheduleType',
              key: 'id',
            },
          },
          id_debt: {
            type: DataTypes.INTEGER,
          },
        },
        { transaction: t },
      ),
    ]),
  );
export const down: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([context.dropTable('ScheduleLinks', { transaction: t })]),
  );
