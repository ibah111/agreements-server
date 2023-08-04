import { QueryInterface } from '@sql-tools/sequelize';
import { DataType } from '@sql-tools/sequelize-typescript';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
  await context.removeColumn('Agreements', 'reg_doc', { transaction });
  await context.renameColumn('Agreements', 'new_reg_doc', 'reg_doc', {
    transaction,
  });
  try {
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
  }
};
export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
  await context.renameColumn('Agreements', 'reg_doc', 'new_reg_doc');
  await context.addColumn('Agreements', 'reg_doc', {
    type: DataType.BOOLEAN,
  });
  try {
    transaction.commit();
  } catch (error) {
    transaction.rollback();
  }
};
