/**
 * меняю тип столбика с int на money
 */
import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.changeColumn(
        'Agreements',
        'discount',
        {
          type: DataTypes.MONEY,
          allowNull: true,
        },
        { transaction: t },
      ),
    ]),
  );

export const down: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.changeColumn(
        'Agreements',
        'discount',
        {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        { transaction: t },
      ),
    ]),
  );
