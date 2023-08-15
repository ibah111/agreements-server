import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { Payments } from '../../Modules/Database/Local.Database/models/Payments';
import { PaymentsInput } from './Payments.input';
import { AuthResult } from '../../Modules/Guards/auth.guard';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payments, 'local')
    private readonly modelPayments: typeof Payments,
  ) {}

  async getSchedule(id_agreement: number) {
    return await this.modelPayments.findAll({
      where: {
        id: id_agreement,
      },
    });
  }
  async createPaymentsSchedule(data: PaymentsInput, user: AuthResult) {
    const [payments, created] = await this.modelPayments.findOrCreate({
      where: {
        id_agreement: data.id_agreement,
      },
      defaults: {
        ...data,
        user: user.userLocal.id,
      },
      logging: console.log,
    });
    if (created) return payments;
  }
}
