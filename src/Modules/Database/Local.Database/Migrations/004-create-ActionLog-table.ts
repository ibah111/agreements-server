import { QueryInterface } from '@sql-tools/sequelize';
import { DataType } from '@sql-tools/sequelize-typescript';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.createTable(
        'action_log',
        {
          id: {
            type: DataType.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          actionType: {
            type: DataType.STRING,
            allowNull: false,
          },
          user: {
            type: DataType.STRING,
            allowNull: false,
            references: { model: 'Users' },
          },

          userRole: {
            type: DataType.STRING,
            allowNull: false,
            references: { model: 'Users_Roles' },
          },
        },
        { transaction: t },
      ),
    ]),
  );
