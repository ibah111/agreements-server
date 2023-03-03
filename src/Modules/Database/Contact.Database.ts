import Models from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';

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
      models: Models, // все модели уже прописаны в пакете
    }),
  ],
})
export class ContactDatabase {}
