import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const t = await context.sequelize.transaction();

  await context.removeConstraint('comments', 'comments_id_Users_fk');

  try {
    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();

  await context.addConstraint('comments', {
    name: 'comments_id_Users_fk',
    fields: ['user'],
    type: 'foreign key',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    references: { field: 'id', table: 'Users' },
    transaction: transaction,
  });

  try {
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
