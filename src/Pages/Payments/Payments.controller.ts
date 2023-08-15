import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './Payments.service';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { PaymentsInput } from './Payments.input';
import { CanGuard } from '../../Modules/Casl/Can.guard';
import { Auth, AuthGuard, AuthResult } from '../../Modules/Guards/auth.guard';
@ApiTags('Payments')
@UseGuards(CanGuard)
@UseGuards(AuthGuard)
@Controller('Payments')
@ApiBasicAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post()
  createPaymentSchedule(@Body() body: PaymentsInput, @Auth() auth: AuthResult) {
    return this.paymentsService.createPaymentsSchedule(body, auth);
  }

  @Get(':/id')
  getSchedulePayments(@Param('id', ParseIntPipe) id_agreement: number) {
    return this.paymentsService.getSchedule(id_agreement);
  }
}
