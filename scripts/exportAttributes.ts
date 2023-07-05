import Models from '@contact/models';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { models } from '../src/Modules/Database/Local.Database/models';
import { Agreement } from '../src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from '../src/Modules/Database/Local.Database/models/AgreementDebtLink';
export const sql = new Sequelize({
  dialect: 'mssql',
  host: 'newct.usb.ru',
  database: 'agreements',
  password: 'usN7WYxkhGEmjOAF',
  username: 'agreements',
  logging: false,
  models,
});
new Sequelize({
  dialect: 'mssql',
  host: 'newct.usb.ru',
  database: 'i_collect',
  password: 'usN7WYxkhGEmjOAF',
  username: 'agreements',
  logging: false,
  models: Models,
});

export const attributesAgremment = Object.keys(Agreement.getAttributes());
export const attributesDebt = Object.keys(AgreementDebtsLink.getAttributes());
