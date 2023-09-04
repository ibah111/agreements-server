import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.createTable(
        'PaymentsToCalc',
        {
          id_payment: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
          },
          id_debt_calc: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
          },
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
      await context.dropTable('PaymentsToCalc', {
        transaction: t,
      }),
    ]),
  );
