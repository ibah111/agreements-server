import Models from '@contact/models';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { models } from '../src/Modules/Database/Local.Database/models';
import { Agreement } from '../src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from '../src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { Comment } from '../src/Modules/Database/Local.Database/models/Comment';

export const sql = new Sequelize({
  dialect: 'mssql',
  host: 'BALEZIN.usb.ru',
  database: 'agreements',
  password: 'usN7WYxkhGEmjOAF',
  username: 'agreements',
  logging: false,
  models,
});
/** readonly */
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
export const attributesComment = Object.keys(Comment.getAttributes());
