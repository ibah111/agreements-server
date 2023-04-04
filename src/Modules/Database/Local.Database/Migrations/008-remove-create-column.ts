import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';
// remove list: last_check, finish_doc, actions_for_get,
export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
  await context.addColumn(
    'Agreements',
    'FIO',
    { type: DataTypes.STRING },
    { transaction },
  );
  await context.removeColumn('Agreements', 'last_check_date', { transaction });
  await context.removeColumn('Agreements', 'finish_doc', { transaction });
  await context.removeColumn('Agreements', 'actions_for_get', { transaction });
  try {
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
  await context.removeColumn('Agreements', 'FIO', { transaction });
  await context.addColumn(
    'Agreements',
    'last_check_date',
    { type: DataTypes.DATE },
    { transaction },
  );
  await context.addColumn(
    'Agreements',
    'finish_doc',
    { type: DataTypes.BOOLEAN },
    { transaction },
  );
  await context.addColumn(
    'Agreements',
    'actions_for_get',
    { type: DataTypes.STRING },
    { transaction },
  );
  try {
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
