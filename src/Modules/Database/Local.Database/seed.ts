import { InjectConnection } from '@sql-tools/nestjs-sequelize';
import { Sequelize } from 'sequelize';

export class LocalDatabaseSeed {
  constructor(@InjectConnection('local') private sequelize: Sequelize) {}
  async sync() {}
}
