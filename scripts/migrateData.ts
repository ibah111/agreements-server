import { Sequelize } from '@sql-tools/sequelize-typescript';
import { models } from '../src/Modules/Database/Local.Database/models';
import { Agreement } from '../src/Modules/Database/Local.Database/models/Agreement';

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
const AgreementLocal = sql2.getRepository(Agreement);
const AgreementWork = sql2.getRepository(Agreement);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function main() {
  const localAgreements = await AgreementLocal.findAll();
  const agreements = await AgreementWork.findAll();

  for (const localAgreement of localAgreements) {
    console.log(localAgreement.id);
    const agreement = agreements.find(
      (item) => item.person_id === localAgreement.person_id,
    );
    if (!agreement) continue;
    agreement.full_req = localAgreement.full_req;
    agreement.sum = localAgreement.sum;
    agreement.discount = localAgreement.discount;
    await agreement.save();
  }
  console.log('Finish');
}
