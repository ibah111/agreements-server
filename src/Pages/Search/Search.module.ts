import {
  Person,
  Portfolio,
  Debt,
  LawExec,
  Dict,
  Address,
  LawAct,
  DebtGuarantor,
  LawExecPersonLink,
} from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { SearchController } from './Search.controller';
import { SearchService } from './Search.service';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [
        Person,
        Portfolio,
        Debt,
        LawExec,
        Dict,
        Address,
        LawAct,
        DebtGuarantor,
        LawExecPersonLink,
      ],
      'contact',
    ),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
