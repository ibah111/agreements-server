import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.User.bulkCreate(
        [
          { id: 3, login: 'it@nbkfinance.ru' },
          { id: 4, login: 'krokhova@zakon43.ru' },
        ],
        { transaction: t },
      ),
    ]),
  );
