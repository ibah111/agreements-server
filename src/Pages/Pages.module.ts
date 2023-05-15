import { Module } from '@nestjs/common';
import { AgreementsModule } from './Agreements/Agr.module';
import { AgreementToDebtModule } from './AgreementsToDebt/AgreementToDebt.module';
import { DebtModule } from './AgreementDebt/AgreementDebt.module';
import { LoginModule } from './Login/Login.module';
import { PurposeModule } from './Purpose/Purpose.module';
import { SearchModule } from './Search/Search.module';
import { UserModule } from './User/User.module';

@Module({
  imports: [
    LoginModule,
    UserModule,
    AgreementsModule,
    PurposeModule,
    SearchModule,
    DebtModule,
    AgreementToDebtModule,
  ],
})
export class PagesModule {}
