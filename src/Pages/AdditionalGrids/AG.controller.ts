import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdditionalGridService } from './AG.service';
import { DataGridClass } from '../DataGridClass/DataGridClass';

@ApiTags('AG')
@Controller('AG')
export class AdditionalGridController {
  constructor(private readonly service: AdditionalGridService) {}

  @Post('getLogs')
  getLogs(@Body() body: DataGridClass) {
    return this.service.getLogs(body);
  }

  @Post('getDeleted')
  getDeleted(@Body() body: DataGridClass) {
    return this.service.getDeleted(body);
  }

  @Patch('restoreDeleted/:id')
  restoreDeleted(@Param('id', ParseIntPipe) id: number) {
    return this.service.restoreDeleted(id);
  }

  @Delete('forceDelete/:id')
  forceDelete(@Param('id', ParseIntPipe) id_agreement: number) {
    return this.service.forceDelete(id_agreement);
  }

  @Post('getAllUsers')
  getAllUserRole(@Body() body: DataGridClass) {
    return this.service.getAllUsers(body);
  }
}
