import { Module } from '@nestjs/common';
import DatabaseModule from './Database/Database.module';

@Module({ imports: [DatabaseModule] })
export class ModuleOfModules {}
