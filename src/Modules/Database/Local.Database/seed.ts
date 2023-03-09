import { LawAct } from '@contact/models';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@sql-tools/nestjs-sequelize';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { join } from 'path';
import createUmzug from '../umzug';
import { Agreement } from './models/Agreement';
import { User } from './models/User.model';
@Injectable()
export class LocalDatabaseSeed {
  constructor(
    @InjectConnection('local') private readonly sequelize: Sequelize,
    @InjectModel(LawAct, 'contact') private readonly modelLawAct: typeof LawAct,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
  ) {}
  async sync() {
    this.modelLawAct.hasMany(Agreement);
    const umzug = createUmzug(this.sequelize, join(__dirname, 'migrations'));
    try {
      await umzug.up();
      await this.seed();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  async seed() {}
}
