import { Module } from '@nestjs/common';
import { AgreementsModule } from './Agreements/Agr.module';
import { AgreementToDebtModule } from './AgreementsToDebt/AgreementToDebt.module';
import { DebtModule } from './AgreenentDebt/AgreementDebt.module';
import { LoginModule } from './Login/Login.module';
import PurposePage from './Purpose/Purpose.page';
import { SearchModule } from './Search/Search.module';
import { UserModule } from './User/User.module';

@Module({
  imports: [
    LoginModule,
    UserModule,
    AgreementsModule,
    PurposePage,
    SearchModule,
    DebtModule,
    AgreementToDebtModule,
  ],
})
export class PagesModule {}
