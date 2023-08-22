import { Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdditionalGridService } from './AG.service';

@ApiTags('AG')
@Controller('AG')
export class AdditionalGridController {
  constructor(private readonly service: AdditionalGridService) {}

  @Get('getLogs')
  getLogs() {
    return this.service.getLogs();
  }

  @Get('getDeleted')
  getDeleted() {
    return this.service.getDeleted();
  }

  @Patch('restoreDeleted/:id')
  restoreDeleted(@Param('id', ParseIntPipe) id: number) {
    return this.service.restoreDeleted(id);
  }
}
