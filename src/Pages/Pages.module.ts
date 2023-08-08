import { Module } from '@nestjs/common';
import { AgreementsModule } from './Agreements/Agr.module';
import { AgreementToDebtModule } from './AgreementsToDebt/AgreementToDebt.module';
import { DebtModule } from './Debt/Debt.module';
import { LoginModule } from './Login/Login.module';
import { PurposeModule } from './Purpose/Purpose.module';
import { SearchModule } from './Search/Search.module';
import { UserModule } from './User/User.module';
import { RegDocModule } from './RegDoc/RegDoc.module';
import { StatusAgreementModule } from './StatusAgreement/StatusAgreement.module';
import { DictModule } from './Dict/Dict.module';
import { TypeAgreementModule } from './AgreementTyp/Type.module';
import { LawExecDebtModule } from './LawExecDebt/LawExecDebt.module';
import { HealthModule } from './Health/Health.module';
import { CollectorModule } from './Collector/Collector.module';
import { PersonPropertiesModule } from './PersonProperty/PersonProperty.module';
import { CommentModule } from './Comments/Comment.module';

@Module({
  imports: [
    LoginModule,
    UserModule,
    AgreementsModule,
    PurposeModule,
    RegDocModule,
    SearchModule,
    DebtModule,
    AgreementToDebtModule,
    StatusAgreementModule,
    DictModule,
    TypeAgreementModule,
    LawExecDebtModule,
    HealthModule,
    CollectorModule,
    PersonPropertiesModule,
    CommentModule,
  ],
})
export class PagesModule {}
