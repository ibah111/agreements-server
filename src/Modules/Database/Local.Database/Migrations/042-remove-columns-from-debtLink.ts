import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.removeColumn('AgreementToDebtLink', 'debt_sum', {
        transaction: t,
      }),
    ]),
  );
export const down: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.addColumn(
        'AgreementToDebtLink',
        'debt_sum',
        {
          type: DataTypes.MONEY,
        },
        { transaction: t },
      ),
    ]),
  );
