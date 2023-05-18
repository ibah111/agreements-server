import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.Role.bulkCreate(
        [{ id: 3, name: 'User', title: 'Пользователь-Смотрящий' }],
        { transaction: t },
      ),
    ]),
  );
