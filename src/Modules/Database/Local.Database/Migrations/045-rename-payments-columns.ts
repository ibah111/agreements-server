import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      //   await context.removeConstraint('Payments', 'payments_id_agreement_fk'),
      await context.removeColumn('Payments', 'id_agreement', {
        transaction: t,
      }),
      //   await context.addColumn(
      //     'Payments',
      //     'id_schedule',
      //     {
      //       type: DataTypes.INTEGER,
      //       allowNull: false,
      //     },
      //     {
      //       transaction: t,
      //     },
      //   ),
    ]),
  );
export const down: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.removeColumn('Payments', 'id_schedule', { transaction: t }),
      await context.addColumn(
        'Payments',
        'id_agreement',
        {
          type: DataTypes.INTEGER,

          allowNull: false,
        },
        {
          transaction: t,
        },
      ),
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
    ]),
  );
