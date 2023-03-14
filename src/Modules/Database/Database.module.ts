import { Module } from '@nestjs/common';
import { ContactDatabase } from './Contact.Database';
import LocalDatabase from './Local.Database';
// коннект к базе
@Module({
  imports: [ContactDatabase, LocalDatabase],
})
export default class DatabaseModule {}
