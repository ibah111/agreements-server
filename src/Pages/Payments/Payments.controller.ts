import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './Payments.service';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import {
  InputPaymentsUpdate,
  PaymentsInput,
  updateStatusInput,
} from './Payments.input';
import { CanGuard } from '../../Modules/Casl/Can.guard';
import { AuthGuard } from '../../Modules/Guards/auth.guard';
@ApiTags('Payments')
@UseGuards(CanGuard)
@UseGuards(AuthGuard)
@Controller('Payments')
@ApiBasicAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post()
  createPaymentSchedule(@Body() body: PaymentsInput) {
    return this.paymentsService.createPaymentsSchedule(body, body.x);
  }

  @Get(':id')
  getSchedulePayments(@Param('id', ParseIntPipe) id_agreement: number) {
    return this.paymentsService.getSchedule(id_agreement);
  }

  @Delete(':id')
  deletePayment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.deletePayment(id);
  }

  @Post('updateStatus')
  updateStatus(@Body() body: updateStatusInput) {
    return this.paymentsService.statusUpdate(body);
  }

  @Get('getCalcsInMonth/:id')
  getCalcsInMonth(@Param('id', ParseIntPipe) id_payment: number) {
    return this.paymentsService.getCalcsInMonth(id_payment);
  }

  @Patch('updateCalc/:id')
  updateCalc(
    @Param('id', ParseIntPipe) id_payment: number,
    @Body() body: InputPaymentsUpdate,
  ) {
    body.id = id_payment;
    return this.paymentsService.updateCalc(body);
  }
}
