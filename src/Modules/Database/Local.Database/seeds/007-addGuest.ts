import { QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.bulkInsert('Users', [
    { login: 'guest', createdAt: new Date(), updatedAt: new Date() },
  ]);
