import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.User_Role.bulkCreate(
        [
          { user_id: 2, role_id: 3 },
          { user_id: 3, role_id: 1 },
          { user_id: 4, role_id: 2 },
        ],
        { transaction: t },
      ),
    ]),
  );
