import { Body, Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgrDelInput } from './Del.input';
import { DelService } from './Del.service';

@ApiTags('DeletedData')
@Controller('Del')
export class DelController {
  constructor(private delService: DelService) {}
  @Get()
  @HttpCode(200)
  async getAllDel(@Body() body: AgrDelInput) {
    return this.delService.getAllDeleted(body);
  }
}
