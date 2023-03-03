import Models from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { ContactDatabase } from './Contact.Database';
import LocalDatabase from './Local.Database';
// коннект к базе
@Module({
  imports: [ContactDatabase, LocalDatabase],
})
export default class DatabaseModule {}
