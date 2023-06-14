import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  await context.sequelize.transaction(async (t) => {
    await context.createTable('purpose_types', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    }),
      await context.createTable(
        'Agreements',
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          r_law_act_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          last_check_date: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
          conclusion_date: {
            allowNull: false,
            type: DataTypes.DATE,
          },
          purpose: {
            type: DataTypes.INTEGER,
            references: { model: 'purpose_types', key: 'id' },
          },
          court_sum: {
            type: DataTypes.MONEY,
          },
          debt_sum: {
            type: DataTypes.MONEY,
          },
          recalculation_sum: {
            type: DataTypes.MONEY,
          },
          discount_sum: {
            type: DataTypes.MONEY,
          },
          month_pay: {
            type: DataTypes.INTEGER,
          },
          reg_doc: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          finish_doc: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          actions_for_get: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          task_link: {
            type: DataTypes.STRING,
          },
          comment: { type: DataTypes.STRING(4000) },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
        },
        { transaction: t },
      );
  });
};
export const down: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.dropTable('Agreements', { transaction: t }),
      context.dropTable('purpose_types', { transaction: t }),
    ]),
  );
