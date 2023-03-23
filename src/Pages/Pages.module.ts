import { Module } from '@nestjs/common';
import { AgreementsModule } from './Agreements/Agr.module';
import { LoginModule } from './Login/Login.module';
import PurposePage from './Purpose/Purpose.page';
import { UserModule } from './User/User.module';

@Module({ imports: [LoginModule, UserModule, AgreementsModule, PurposePage] })
export class PagesModule {}
