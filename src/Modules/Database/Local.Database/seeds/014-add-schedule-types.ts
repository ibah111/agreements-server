import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.ScheduleType.bulkCreate(
        [
          {
            id: 1,
            title: 'Общий',
          },
          {
            id: 2,
            title: 'Индивидуальный (по кд)',
          },
        ],
        { transaction: t },
      ),
    ]),
  );
