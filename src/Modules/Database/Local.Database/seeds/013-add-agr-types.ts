import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.TypeAgreement.bulkCreate(
        [
          {
            id: 5,
            title: 'Договор купли-продажи',
          },
          {
            id: 6,
            title: 'Договор о погашении долга',
          },
          {
            id: 7,
            title: 'Договор об уступке долга',
          },
        ],
        { transaction: t },
      ),
    ]),
  );
