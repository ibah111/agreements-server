import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@sql-tools/nestjs-sequelize';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { join } from 'path';
import createUmzug from '../umzug';
import { User } from './models/User.model';
@Injectable()
export class LocalDatabaseSeed {
  constructor(
    @InjectConnection('local') private readonly sequelize: Sequelize,
    @InjectModel(User, 'local') private readonly modelUser: typeof User,
  ) {}
  async sync() {
    const umzug = createUmzug(this.sequelize, join(__dirname, 'migrations'));
    try {
      await umzug.up();
      await this.seed();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  async seed() {
    console.log(await this.modelUser.findAll());
  }
}
