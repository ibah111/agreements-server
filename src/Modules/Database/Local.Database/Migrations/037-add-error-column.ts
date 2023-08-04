import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
  await context.addColumn('Agreements', 'error', { type: DataTypes.INTEGER });
  try {
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
  await context.removeColumn('Agreements', 'error');
  try {
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
