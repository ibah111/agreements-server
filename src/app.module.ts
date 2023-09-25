import { Module } from '@nestjs/common';
import { ModuleOfModules } from './Modules';
import { PagesModule } from './Pages/Pages.module';
import { ConfigModule } from '@nestjs/config';
import getEnv from './utils/getEnv';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getEnv],
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev',
    }),
    ModuleOfModules,
    PagesModule,
  ],
})
export class AppModule {}
