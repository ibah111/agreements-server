import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import StatusAgreementService from './StatusAgreement.service';

@ApiTags('StatusAgreement')
@UseGuards(AuthGuard)
@Controller('StatusAgreement')
export default class StatusAgreementController {
  constructor(private readonly service: StatusAgreementService) {}
  @Get()
  async getAll() {
    return await this.service.getAll();
  }
}
