import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
  await context.addColumn('AgreementToDebtLink', 'status', {
    type: DataTypes.INTEGER,
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
  await context.removeColumn('AgreementToDebtLink', 'status');
  try {
    transaction.commit();
  } catch (error) {
    console.log(error);
    transaction.rollback();
  }
};
