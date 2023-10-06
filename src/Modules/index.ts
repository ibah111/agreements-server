import { Module } from '@nestjs/common';
import { CaslModule } from './Casl/Casl.module';
import DatabaseModule from './Database/Database.module';
import { SocketModule } from './Socket/Socket.module';
import { PreviewGeneratorModule } from './PreviewGenerator/PreviewGenerator.module';
import { CronModule } from './CRON/Cron.module';
import { MathModule } from './Math/Math.module';

@Module({
  imports: [
    DatabaseModule,
    CaslModule,
    SocketModule,
    PreviewGeneratorModule,
    CronModule,
    MathModule,
  ],
})
export class ModuleOfModules {}
