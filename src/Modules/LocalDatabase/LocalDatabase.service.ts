import { InjectConnection } from '@sql-tools/nestjs-sequelize';
import { Sequelize } from '@sql-tools/sequelize';

export class LocalDataBaseService {
  constructor(@InjectConnection() private sequelize: Sequelize) {}
  async sync() {
    await this.sequelize.sync();
  }
}
