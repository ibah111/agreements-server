import { Module } from '@nestjs/common';
import { CaslModule } from './Casl/Casl.module';
import DatabaseModule from './Database/Database.module';
import { SocketModule } from './Socket/Socket.module';

@Module({ imports: [DatabaseModule, CaslModule, SocketModule] })
export class ModuleOfModules {}
