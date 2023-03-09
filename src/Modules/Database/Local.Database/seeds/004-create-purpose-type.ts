import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.PurposeType.bulkCreate(
        [
          {
            id: 1,
            title: 'Задолженность взыскана банком',
          },
          {
            id: 2,
            title: 'Задолженность взыскана НБК',
          },
          {
            id: 3,
            title: 'Пересчет',
          },
          {
            id: 4,
            title: 'Индексация',
          },
        ],
        { transaction: t },
      ),
    ]),
  );
