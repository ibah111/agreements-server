import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import RegDocService from './RegDoc.service';
``;

@ApiTags('RegDoc')
@UseGuards(AuthGuard)
@Controller('RegDoc')
export default class RegDocController {
  constructor(private readonly service: RegDocService) {}
  @Get()
  async getAll() {
    return await this.service.getAll();
  }
}
