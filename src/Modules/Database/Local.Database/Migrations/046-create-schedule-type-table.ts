import { QueryInterface, DataTypes } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(
    async (t) =>
      await Promise.all([
        context.createTable(
          'ScheduleType',
          {
            id: {
              type: DataTypes.INTEGER,
              autoIncrement: true,
              allowNull: false,
              primaryKey: true,
            },
            title: {
              type: DataTypes.STRING,
              allowNull: false,
            },
            createdAt: { type: DataTypes.DATE, allowNull: false },
            updatedAt: { type: DataTypes.DATE, allowNull: false },
          },
          { transaction: t },
        ),
      ]),
  );
export const down: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([await context.dropTable('ScheduleType', { transaction: t })]),
  );
