import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OverdueService } from './OD.service';

@ApiTags('OverdueDebts')
@Controller('OverdueDebts')
export class OverdueDebtsController {
  constructor(private readonly service: OverdueService) {}
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.service.checkAgreementOverdue(id);
  }
}
