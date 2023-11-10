import { Sequelize } from '@sql-tools/sequelize-typescript';
import { models } from '../src/Modules/Database/Local.Database/models';
import { Agreement } from '../src/Modules/Database/Local.Database/models/Agreement';
import Models, { User } from '@contact/models';

export const sql1 = new Sequelize({
  dialect: 'mssql',
  host: 'newct.usb.ru',
  database: 'agreements',
  password: 'usN7WYxkhGEmjOAF',
  username: 'agreements',
  logging: false,
  repositoryMode: true,
  models,
});
export const sql2 = new Sequelize({
  dialect: 'mssql',
  host: 'BALEZIN.usb.ru',
  database: 'agreements',
  password: 'usN7WYxkhGEmjOAF',
  username: 'agreements',
  logging: false,
  repositoryMode: true,
  models,
});
export const i_collect = new Sequelize({
  dialect: 'mssql',
  host: 'newct.usb.ru',
  database: 'i_collect',
  password: 'usN7WYxkhGEmjOAF',
  username: 'agreements',
  logging: false,
  models: Models,
});

// const AgreementReal = sql1.getRepository(Agreement);
const AgreementLocal = sql2.getRepository(Agreement);
const UsersReal = i_collect.getRepository(User);
async function main() {
  const collectors = await AgreementLocal.findAll({
    attributes: [[Sequelize.literal('DISTINCT collector_id'), 'collector_id']],
    order: [['collector_id', 'asc']],
  });
  const collectors_ids = collectors.map((i) => i.collector_id!);
  console.log(collectors_ids);

  for (const id of collectors_ids) {
    if (id === 0) continue;
    const user = await UsersReal.findOne({
      where: {
        id,
      },
      include: {
        association: 'Department',
        attributes: ['name'],
      },
    });
    console.log(user);
    // const collectorCreate = await CollectorLocal.create({
    //   id_contact: user!.id,
    //   department_name: user?.Department?.name || '',
    //   fio: [user?.f, user?.i, user?.o].join(' '),
    // });
    // console.log(collectorCreate);
  }
}
main();
