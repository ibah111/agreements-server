import { Module } from '@nestjs/common';
import { AgreementsModule } from './Agreements/Agr.module';
import { AgreementToDebtModule } from './AgreementsToDebt/AgreementToDebt.module';
import { DebtModule } from './AgreementDebt/AgreementDebt.module';
import { LoginModule } from './Login/Login.module';
import { PurposeModule } from './Purpose/Purpose.module';
import { SearchModule } from './Search/Search.module';
import { UserModule } from './User/User.module';
import { RegDocModule } from './RegDoc/RegDoc.module';
import { StatusAgreementModule } from './StatusAgreement/StatusAgreement.module';
import { DictModule } from './Dict/Dict.module';
import { TypeAgreementModule } from './AgreementTyp/Type.module';

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
  ],
})
export class PagesModule {}
