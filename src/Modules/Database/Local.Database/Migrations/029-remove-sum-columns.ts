import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
  await context.removeColumn('Agreements', 'bank_sum', { transaction });
  await context.removeColumn('Agreements', 'court_sum', { transaction });
  await context.removeColumn('Agreements', 'debt_sum', { transaction });
  await context.removeColumn('Agreements', 'recalculation_sum', {
    transaction,
  });
  try {
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
  await context.addColumn(
    'Agreements',
    'bank_sum',
    { type: DataTypes.MONEY },
    { transaction },
  );
  await context.addColumn(
    'Agreements',
    'court_sum',
    { type: DataTypes.MONEY },
    { transaction },
  );
  await context.addColumn(
    'Agreements',
    'debt_sum',
    { type: DataTypes.MONEY },
    { transaction },
  );
  await context.addColumn(
    'Agreements',
    'recalculation_sum',
    { type: DataTypes.MONEY },
    { transaction },
  );
  try {
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
