import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import PurposeService from './purpose.service';

@ApiTags('Purpose')
@UseGuards(AuthGuard)
@Controller('Purpose')
export default class PurposeController {
  constructor(private readonly service: PurposeService) {}
  @Get()
  async getAll() {
    return await this.service.getAll();
  }
}
