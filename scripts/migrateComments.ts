import { Sequelize } from '@sql-tools/sequelize-typescript';
import { models } from '../src/Modules/Database/Local.Database/models';
import { Agreement } from '../src/Modules/Database/Local.Database/models/Agreement';
import { Comment } from '../src/Modules/Database/Local.Database/models/Comment';

export const sql = new Sequelize({
  dialect: 'mssql',
  host: 'newct.usb.ru',
  database: 'agreements',
  password: 'usN7WYxkhGEmjOAF',
  username: 'agreements',
  logging: false,
  models,
});

async function main() {
  const agrements = await Agreement.findAll();
  for (const agreement of agrements) {
    if (agreement.comment) {
      console.log(agreement.id);
      await Comment.create({
        id_agreement: agreement.id,
        user: 1,
        comment: agreement.comment,
      });
    }
  }
  console.log('Finish');
}
main();
