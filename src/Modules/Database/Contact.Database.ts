import Models from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
/**модели берутеся из контакта */
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mssql',
      host: 'newct.usb.ru',
      username: 'contact',
      password: 'contact',
      database: 'i_collect3',
      name: 'contact',
      logging: console.log,
      models: Models,
    }),
  ],
})
export class ContactDatabase {}
