import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.addConstraint('ScheduleLinks', {
        name: 'schedule_links_id_Agreements_fk',
        fields: ['id_agreement'],
        type: 'foreign key',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: { field: 'id', table: 'Agreements' },
        transaction: t,
      }),
    ]),
  );
export const down: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction(async (t) =>
    Promise.all([
      await context.removeConstraint(
        'ScheduleLinks',
        'schedule_links_id_Agreements_fk',
        {
          transaction: t,
        },
      ),
    ]),
  );
