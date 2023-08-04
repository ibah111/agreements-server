import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
  await context.addColumn('AgreementToDebtLink', 'contract', {
    type: DataTypes.STRING,
  });
  await context.addColumn('AgreementToDebtLink', 'debt_sum', {
    type: DataTypes.MONEY,
  });
  await context.addColumn('AgreementToDebtLink', 'name', {
    type: DataTypes.STRING,
  });
  await context.addColumn('AgreementToDebtLink', 'payable_status', {
    type: DataTypes.BOOLEAN,
  });
  await context.addColumn('AgreementToDebtLink', 'portfolio', {
    type: DataTypes.INTEGER,
  });
  await context.addColumn('AgreementToDebtLink', 'before_agreement', {
    type: DataTypes.MONEY,
  });
  await context.addColumn('AgreementToDebtLink', 'first_payment', {
    type: DataTypes.MONEY,
  });
  await context.addColumn('AgreementToDebtLink', 'first_payment_date', {
    type: DataTypes.DATE,
  });
  await context.addColumn('AgreementToDebtLink', 'last_payment', {
    type: DataTypes.MONEY,
  });
  await context.addColumn('AgreementToDebtLink', 'last_payment_date', {
    type: DataTypes.DATE,
  });
  await context.addColumn('AgreementToDebtLink', 'sum_payments', {
    type: DataTypes.MONEY,
  });
  await context.addColumn('AgreementToDebtLink', 'error', {
    type: DataTypes.INTEGER,
  });
  try {
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
  }
};
export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
  await context.removeColumn('AgreementToDebtLink', 'contract');
  await context.removeColumn('AgreementToDebtLink', 'debt_sum');
  await context.removeColumn('AgreementToDebtLink', 'name');
  await context.removeColumn('AgreementToDebtLink', 'dict');
  await context.removeColumn('AgreementToDebtLink', 'portfolio');
  try {
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
  }
};
