import { Module } from '@nestjs/common';
import { CaslModule } from './Casl/Casl.module';
import DatabaseModule from './Database/Database.module';

@Module({ imports: [DatabaseModule, CaslModule] })
export class ModuleOfModules {}
