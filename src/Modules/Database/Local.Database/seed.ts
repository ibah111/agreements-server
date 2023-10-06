import { Debt, DebtCalc } from '@contact/models';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@sql-tools/nestjs-sequelize';
import { Op } from '@sql-tools/sequelize';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { join } from 'path';
import createUmzug from '../umzug';
import AgreementDebtsLink from './models/AgreementDebtLink';
@Injectable()
export class LocalDatabaseSeed implements OnModuleInit {
  constructor(
    @InjectConnection('local') private readonly sequelize: Sequelize,
    @InjectConnection('contact') private readonly sequelizeContact: Sequelize,
    @InjectModel(Debt, 'contact') private readonly modelDebt: typeof Debt,
    @InjectModel(DebtCalc, 'contact')
    private readonly modelDebtCalc: typeof DebtCalc,
    @InjectModel(AgreementDebtsLink, 'local')
    private readonly modelLink: typeof AgreementDebtsLink,
  ) {}
  onModuleInit() {
    return this.sync();
  }
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
    this.modelDebt.hasMany(this.modelLink, { foreignKey: 'id_debt' });
    this.modelLink.belongsTo(this.modelDebt, { foreignKey: 'id_debt' });
    this.modelDebt.hasMany(this.modelDebtCalc, {
      foreignKey: 'parent_id',
      as: 'LastCalcs',
      scope: {
        calc_date: {
          [Op.gte]: Sequelize.fn(
            'DATEADD',
            Sequelize.literal('day'),
            -31,
            Sequelize.fn('GETDATE'),
          ),
        },
        is_confirmed: 1,
        is_cancel: 0,
        purpose: {
          [Op.notIn]: [7],
          [Op.or]: [1, 2, 3, 4, 5, 8, 9, 10, null],
        },
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
