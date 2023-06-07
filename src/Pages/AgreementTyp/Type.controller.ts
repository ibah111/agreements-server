import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import TypeService from './Type.service';

@ApiTags('Type')
@UseGuards(AuthGuard)
@Controller('Type')
export default class TypeController {
  constructor(private readonly service: TypeService) {}
  @Get()
  async getAll() {
    return await this.service.getAll();
  }
}
