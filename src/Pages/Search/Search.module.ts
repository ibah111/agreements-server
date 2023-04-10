import {
  Person,
  Portfolio,
  Debt,
  Dict,
  Address,
  LawAct,
  DebtGuarantor,
} from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { SearchController } from './Search.controller';
import { SearchService } from './Search.service';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [Person, Portfolio, Debt, Dict, Address, LawAct, DebtGuarantor],
      'contact',
    ),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
