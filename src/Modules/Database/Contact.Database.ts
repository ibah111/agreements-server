import Models from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mssql',
      host: 'newct.usb.ru',
      database: 'i_collect',
      password: 'usN7WYxkhGEmjOAF',
      username: 'agreements',
      name: 'contact',
      logging: false,
      models: Models,
    }),
  ],
})
export class ContactDatabase {}
