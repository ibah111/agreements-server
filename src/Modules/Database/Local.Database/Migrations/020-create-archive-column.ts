import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';
export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();

  await context.addColumn('Agreements', 'archive', {
    type: DataTypes.STRING,
    allowNull: true,
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

  await context.removeColumn('Agreements', 'archive');

  try {
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
