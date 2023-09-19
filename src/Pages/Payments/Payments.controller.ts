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
  CreateScheduleLink,
  DeletePaymentList,
  InputPaymentsUpdate,
  PaymentsInput,
  updateStatusInput,
} from './Payments.input';
import { CanGuard } from '../../Modules/Casl/Can.guard';
import { AuthGuard } from '../../Modules/Guards/auth.guard';
@ApiTags('Payments')
@Controller('Payments')
// @UseGuards(CanGuard)
// @UseGuards(AuthGuard)
// @ApiBasicAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post()
  createPaymentSchedule(@Body() body: PaymentsInput) {
    return this.paymentsService.createPaymentsSchedule(body, body.x);
  }

  @Get('getSchedule/:id')
  getSchedulePayments(@Param('id', ParseIntPipe) id_agreement: number) {
    return this.paymentsService.getSchedule(id_agreement);
  }

  @Get('getPayment/:id')
  getPayment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.getPayment(id);
  }

  @Delete('deletePayment/:id')
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

  @Post('updatePayments/:id')
  createCalculationToCalcs(@Param('id', ParseIntPipe) id_schedule: number) {
    return this.paymentsService.createCalculationToCalcs(id_schedule);
  }

  @Delete('deleteList')
  deleteListPayments(@Body() body: DeletePaymentList) {
    return this.paymentsService.deleteListOfPayments(body.list);
  }

  @Get('getAllScheduleTypes')
  getAllScheduleTypes() {
    return this.paymentsService.getAllScheduleTypes();
  }

  @Get('getAllSchedulesByAgreement/:id_agreement')
  getAllSchedulesByAgreement(
    @Param('id_agreement', ParseIntPipe) id_agreement: number,
  ) {
    return this.paymentsService.getAllSchedulesByAgreement(id_agreement);
  }

  @Get(`getAvailableDebtForSchedule/:id_agreement`)
  getAvailableDebtForSchedule(
    @Param('id_agreement', ParseIntPipe) id_agreement: number,
  ) {
    return this.paymentsService.getAvailableDebtForSchedule(id_agreement);
  }

  @Delete('deleteScheduleLink/:id')
  deleteScheduleLink(@Param('id', ParseIntPipe) id_schedule: number) {
    return this.paymentsService.deleteScheduleLinks(id_schedule);
  }

  @Post('createScheduleLink')
  createScheduleLink(@Body() body: CreateScheduleLink) {
    return this.paymentsService.createScheduleLink(body);
  }
}
