import { Sequelize } from '@sql-tools/sequelize-typescript';
import glob from 'glob';
import path from 'path';
import { SequelizeStorage, Umzug } from 'umzug';
export default function createUmzug(seq: Sequelize, mig: string) {
  const dir = path.relative('', mig).replaceAll('\\', '/') + '/*.js';
  return new Umzug({
    context: seq.getQueryInterface(),
    migrations: {
      glob: dir,
    },
    storage: new SequelizeStorage({ sequelize: seq }),
    logger: console,
  });
}
