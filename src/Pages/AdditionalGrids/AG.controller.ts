import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdditionalGridService } from './AG.service';
import { DeleteInput } from './AG.input';

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

  @Patch('restoreDeleted')
  restoreDeleted(@Body() body: DeleteInput) {
    return this.service.restoreDeleted(body.id);
  }
}
