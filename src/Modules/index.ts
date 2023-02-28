import { Module } from '@nestjs/common/decorators';
import { LocalDatabaseModule } from './LocalDatabase/LocalDatabase.module';

@Module({ imports: [LocalDatabaseModule] })
export class ModuleOfModules {}
