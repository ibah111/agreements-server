import { Module } from '@nestjs/common';
import { ContactLogService } from './ContactLog.service';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { ContactLog, Debt, Person } from '@contact/models';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { ContactLogController } from './ContactLog.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Person, Debt, ContactLog], 'contact'),
    SequelizeModule.forFeature([Agreement, AgreementDebtsLink], 'local'),
  ],
  controllers: [ContactLogController],
  providers: [ContactLogService],
})
export class ContactLogModule {}
