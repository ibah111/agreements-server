import { Debt, DebtCalc } from '@contact/models';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@sql-tools/nestjs-sequelize';
import { Op } from '@sql-tools/sequelize';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { join } from 'path';
import createUmzug from '../umzug';
import { Agreement } from './models/Agreement';
import AgreementDebtsLink from './models/AgreementDebtLink';
@Injectable()
export class LocalDatabaseSeed {
  constructor(
    @InjectConnection('local') private readonly sequelize: Sequelize,
    @InjectConnection('contact') private readonly sequelizeContact: Sequelize,
    @InjectModel(Debt, 'contact') private readonly modelDebt: typeof Debt,
    @InjectModel(DebtCalc, 'contact')
    private readonly modelDebtCalc: typeof DebtCalc,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(AgreementDebtsLink, 'local')
    private readonly modelLink: typeof AgreementDebtsLink,
  ) {}
  async sync() {
    const umzug = createUmzug(
      this.sequelize,
      join(__dirname, 'migrations'),
      'MigrationMeta',
    );

    try {
      await this.sequelizeContact.authenticate();
      await this.sequelize.authenticate();
      await umzug.up();
      await this.seed();
    } catch (e) {
      console.log(e);
      throw e;
    }
    this.modelDebt.hasOne(this.modelLink, { foreignKey: 'id_agreement' });
    this.modelLink.belongsTo(this.modelDebt, { foreignKey: 'id_debt' });
    this.modelDebt.hasMany(this.modelDebtCalc, {
      foreignKey: 'parent_id',
      as: 'LastCalcs',
      scope: {
        dt: {
          [Op.gte]: Sequelize.fn(
            'DATEADD',
            Sequelize.literal('day'),
            -30,
            Sequelize.fn('GETDATE'),
          ),
        },
        is_confirmed: 1,
      },
    });
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
