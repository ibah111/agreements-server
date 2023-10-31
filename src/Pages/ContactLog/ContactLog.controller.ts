import { Controller, Get, Param } from '@nestjs/common';
import { ContactLogService } from './ContactLog.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ContactLog')
@Controller('ContactLog')
export class ContactLogController {
  constructor(private readonly contactLogService: ContactLogService) {}

  @Get(':id_agreement')
  getContactLogInfo(@Param('id_agreement') id_agreement: number) {
    return this.contactLogService.getContactLogInfo(id_agreement);
  }
}
