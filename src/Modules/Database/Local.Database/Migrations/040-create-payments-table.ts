import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.createTable('Payments', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        id_agreement: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        pay_day: {
          type: DataTypes.DATE,
        },
        sum_owe: {
          type: DataTypes.MONEY,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        user: { type: DataTypes.INTEGER, allowNull: false },
      }),
      await context.addConstraint('Payments', {
        name: 'payments_id_agreement_fk',
        fields: ['id_agreement'],
        type: 'foreign key',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          field: 'id',
          table: 'Agreements',
        },
        transaction: t,
      }),
      await context.addConstraint('Payments', {
        name: 'comments_id_Users_fk',
        fields: ['user'],
        type: 'foreign key',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: { field: 'id', table: 'Users' },
        transaction: t,
      }),
    ]),
  );
export const down: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.dropTable('Payments', { transaction: t }),
      await context.removeConstraint('Payments', 'payments_id_agreement_fk'),
    ]),
  );
