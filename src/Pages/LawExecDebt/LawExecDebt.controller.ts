import { UseGuards, Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBasicAuth } from '@nestjs/swagger';
import { CanGuard } from 'src/Modules/Casl/Can.guard';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import { GetLawExecInput } from './LawExecDebt.input';
import { LawExecDebtService } from './LawExecDebt.service';

@ApiTags('LawExecDebt')
@UseGuards(CanGuard)
@UseGuards(AuthGuard)
@Controller('LawExecDebt')
@ApiBasicAuth()
export class LawExecDebtController {
  constructor(private readonly service: LawExecDebtService) {}

  @Post('getExecs')
  async getExecs(@Body() body: GetLawExecInput) {
    return await this.service.getLawExecDebt(body.agreementId);
  }
}
