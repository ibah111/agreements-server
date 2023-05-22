import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.PurposeType.bulkCreate(
        [
          {
            id: 1,
            title: 'На исполнении',
          },
          {
            id: 2,
            title: 'В регистраторе',
          },
          {
            id: 3,
            title: 'В архиве',
          },
        ],
        { transaction: t },
      ),
    ]),
  );
