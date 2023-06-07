import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.TypeAgreement.bulkCreate(
        [
          {
            id: 1,
            title: 'Обычное',
          },
          {
            id: 2,
            title: 'Соглашение об отступном',
          },
          {
            id: 3,
            title: 'Мировое соглашение',
          },
          {
            id: 4,
            title: 'Договор уступки прав',
          },
        ],
        { transaction: t },
      ),
    ]),
  );
