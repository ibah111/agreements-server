import { Controller, Get, Param } from '@nestjs/common';
import { Body, Delete, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAgreementInput } from './Agr.input';
import { AgreementsService } from './Agr.service';

@ApiTags('Agreements')
@Controller('Agreements')
export class AgreementsController {
  constructor(private readonly service: AgreementsService) {}

  @Post()
  createAgreement(@Body() body: CreateAgreementInput) {
    return;
  }
  @Get(':id')
  getAgreement(@Param('id') index: number) {
    return this.service.getAgreement(index);
  }
  @Delete(':id')
  deleteAgreement(@Param('id') index: number) {
    return this.service.deleteAgreement(index);
  }
}
