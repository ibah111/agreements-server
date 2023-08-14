import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.createTable('Payments', {
        id_agreement: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        pay_day: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        sum_owe: {
          type: DataTypes.MONEY,
          allowNull: false,
        },
        sum_payed: {
          type: DataTypes.MONEY,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      }),
      context.addConstraint('Payments', {
        name: 'payments_id_agreement_fk',
        fields: ['id_agreement'],
        type: 'foreign key',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          field: 'id_agreement',
          table: 'Agreements',
        },
        transaction: t,
      }),
    ]),
  );
export const down: MigrationFn<QueryInterface> = async ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.dropTable('Payments', { transaction: t }),
      context.removeConstraint('Payments', 'payments_id_agreement_fk'),
    ]),
  );
