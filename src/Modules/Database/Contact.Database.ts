import Models from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
/**модели берутеся из контакта */
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mssql',
      host: 'newct.usb.ru',
      database: 'i_collect',
      dialectOptions: {
        authentication: {
          type: 'ntlm',
          options: {
            userName: 'Баледин',
            password: 'GeForce760ti',
            domain: 'USB',
          },
        },
      },
      name: 'contact',
      logging: false,
      models: Models,
    }),
  ],
})
export class ContactDatabase {}
