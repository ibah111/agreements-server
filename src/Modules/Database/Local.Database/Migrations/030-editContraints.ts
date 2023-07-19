import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const t = await context.sequelize.transaction();

  await context.removeConstraint('comments', 'comments_id_Users_fk');
  await context.removeConstraint('comments', 'comments_id_Agreements_fk');

  await context.addConstraint('comments', {
    name: 'comments_id_Users_fk',
    fields: ['user'],
    type: 'foreign key',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    references: { field: 'id', table: 'Users' },
    transaction: t,
  });

  await context.addConstraint('comments', {
    name: 'comments_id_Agreements_fk',
    fields: ['id_agreement'],
    type: 'foreign key',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    references: { field: 'id', table: 'Agreements' },
    transaction: t,
  });
  try {
    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();

  await context.removeConstraint('comments', 'comments_id_Users_fk');
  await context.removeConstraint('comments', 'comments_id_Agreements_fk');

  await context.addConstraint('comments', {
    name: 'comments_id_Users_fk',
    fields: ['user'],
    type: 'foreign key',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    references: { field: 'id', table: 'Users' },
    transaction: transaction,
  });

  await context.addConstraint('comments', {
    name: 'comments_id_Agreements_fk',
    fields: ['id_agreement'],
    type: 'foreign key',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    references: { field: 'id', table: 'Agreements' },
    transaction: transaction,
  });

  try {
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
