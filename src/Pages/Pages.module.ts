import { Module } from '@nestjs/common';
import { AgreementsModule } from './Agreements/Agr.module';
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
  ],
})
export class PagesModule {}
