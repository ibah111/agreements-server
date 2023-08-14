import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
  await context.addColumn('Agreements', 'payable_status', {
    type: DataTypes.BOOLEAN,
  });
  try {
    transaction.commit();
  } catch (error) {
    console.log(error);
    transaction.rollback();
  }
};
export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
  await context.removeColumn('Agreements', 'payable_status');
  try {
    transaction.commit();
  } catch (error) {
    console.log(error);
    transaction.rollback();
  }
};
