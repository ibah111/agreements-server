import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ToolsTerminusModule } from '@tools/terminus-indicators';
import { HealthController } from './Health.controller';

@Module({
  imports: [TerminusModule, ToolsTerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
