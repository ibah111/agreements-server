import { QueryInterface, DataTypes } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const t = await context.sequelize.transaction();
  const t1 = await context.sequelize.transaction({ transaction: t });
  await context.createTable(
    'comments',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_agreement: { type: DataTypes.INTEGER, allowNull: false },
      comment: { type: DataTypes.STRING(4000) },
      user: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { transaction: t1 },
  );
  try {
    await t1.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }
  const t2 = await context.sequelize.transaction({ transaction: t });

  await context.addConstraint('comments', {
    name: 'comments_id_Users_fk',
    fields: ['user'],
    type: 'foreign key',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    references: { field: 'id', table: 'Users' },
    transaction: t2,
  });

  await context.addConstraint('comments', {
    name: 'comments_id_Agreements_fk',
    fields: ['id_agreement'],
    type: 'foreign key',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    references: { field: 'id', table: 'Agreements' },
    transaction: t2,
  });
  try {
    await t2.commit();
    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
