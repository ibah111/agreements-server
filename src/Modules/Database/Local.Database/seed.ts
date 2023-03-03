import { InjectConnection } from '@sql-tools/nestjs-sequelize';
import { Sequelize } from '@sql-tools/sequelize-typescript';

export class LocalDatabaseSeed {
  constructor(@InjectConnection('local') private sequelize: Sequelize) {}
  async sync() {}
}
