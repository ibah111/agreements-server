import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.createTable('ActionLogs', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    actionType: { type: DataTypes.INTEGER, allowNull: false },
    field: { type: DataTypes.STRING, allowNull: false },
    row_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Agreements', key: 'id' },
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    old_value: { type: DataTypes.STRING(4000) },
    new_value: { type: DataTypes.STRING(4000) },
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
  });
export const down: MigrationFn<QueryInterface> = ({ context }) =>
  context.dropTable('ActionLogs');
