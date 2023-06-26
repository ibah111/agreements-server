import Models from '@contact/models';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { models } from '../src/Modules/Database/Local.Database/models';
import { Agreement } from '../src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from '../src/Modules/Database/Local.Database/models/AgreementDebtLink';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  models: models,
  logging: false,
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const contactsequelize = new Sequelize({
  dialect: 'mssql',
  host: 'newct.usb.ru',
  database: 'i_collect',
  password: 'contact',
  username: 'contact',
  logging: false,
  models: Models,
});
export const attributesAgremment = Object.keys(Agreement.getAttributes());
export const attributesDebt = Object.keys(AgreementDebtsLink.getAttributes());
