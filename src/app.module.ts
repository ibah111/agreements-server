import { Module } from '@nestjs/common';
import { ModuleOfModules } from './Modules';

@Module({
  imports: [ModuleOfModules],
})
export class AppModule {}
