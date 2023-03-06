import { Module } from '@nestjs/common';
import { ModuleOfModules } from './Modules';
import { PagesModule } from './Pages/Pages.module';

@Module({
  imports: [ModuleOfModules, PagesModule],
})
export class AppModule {}
