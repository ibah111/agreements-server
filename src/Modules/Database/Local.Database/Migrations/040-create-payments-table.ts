import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
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
  });
  try {
    transaction.commit;
  } catch (error) {
    console.log(error);
    transaction.rollback();
  }
};
export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  const transaction = await context.sequelize.transaction();
  context.dropTable('Payments');
  try {
    transaction.commit();
  } catch (error) {
    transaction.rollback();
  }
};
