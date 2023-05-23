import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.StatusAgreement.bulkCreate(
        [
          {
            id: 1,
            title: 'Действующие',
          },
          {
            id: 2,
            title: 'Исполненные',
          },
          {
            id: 3,
            title: 'Утратившие силу',
          },
          {
            id: 4,
            title: 'Соглашения об отсупном',
          },
        ],
        { transaction: t },
      ),
    ]),
  );
