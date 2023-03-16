import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import PurposeService from './purpose.service';

@ApiTags('Purpose')
@Controller('Purpose')
export default class PurposeController {
  constructor(private readonly service: PurposeService) {}
  @Post('GetAll')
  async getAll() {
    return await this.service.getAll();
  }
}
