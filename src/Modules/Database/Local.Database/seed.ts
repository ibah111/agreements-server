import { LawAct } from '@contact/models';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@sql-tools/nestjs-sequelize';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { join } from 'path';
import createUmzug from '../umzug';
import { Agreement } from './models/Agreement';
@Injectable()
export class LocalDatabaseSeed {
  constructor(
    @InjectConnection('local') private readonly sequelize: Sequelize,
    @InjectConnection('contact') private readonly sequelizeContact: Sequelize,
    @InjectModel(LawAct, 'contact') private readonly modelLawAct: typeof LawAct,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
  ) {}
  async sync() {
    this.modelLawAct.hasMany(Agreement, { foreignKey: 'r_law_act_id' });
    this.modelAgreement.belongsTo(LawAct, { foreignKey: 'r_law_act_id' });
    const umzug = createUmzug(
      this.sequelize,
      join(__dirname, 'migrations'),
      'MigrationMeta',
    );
    try {
      await this.sequelizeContact.authenticate();
      await umzug.up();
      await this.seed();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  async seed() {
    const umzug = createUmzug(
      this.sequelize,
      join(__dirname, 'seeds'),
      'SeedMeta',
    );
    await umzug.up();
  }
}
