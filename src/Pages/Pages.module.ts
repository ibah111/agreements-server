import { Module } from '@nestjs/common';
import { AgreementsModule } from './Agreements/Agr.module';
import { UserModule } from './User/User.module';

@Module({ imports: [UserModule, AgreementsModule] })
export class PagesModule {}
