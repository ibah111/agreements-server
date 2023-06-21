import { Debt, DebtCalc } from '@contact/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';

@Injectable()
export class OverdueService {
  constructor(
    /**
     * Contact Type Models
     */
    @InjectModel(Debt, 'contact')
    private readonly modelDebt: typeof Debt,
    @InjectModel(DebtCalc, 'contact')
    private readonly modelDebtCalc: typeof DebtCalc,
    /**
     * Local Type Models
     */
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(AgreementDebtsLink, 'local')
    private readonly modelDebtLink: typeof AgreementDebtsLink,
  ) {}
  getTimeStepPayments(agreement: Agreement) {
    const cd = agreement.conclusion_date;
    const timeQuery = 
  }
  /**
   * Проверяет последние платежи
   * @param agreementId Номер согласа
   * @returns 1) делает запрос по соглашению в историю платежей
   * 2) взяв из соглашения дату заключения от нее проверяет все платежи
   * 3) далее делает запрос в базу: DateAdd(month -2, getDate())
   * 4) запрос должен вернуть несколько записей
   * о платежах за 2-3 месяца, если запрос возвращает ничего значит
   * должник не платит
   */
  async checkAgreementOverdue(agreement: Agreement) {
    return;
  }
  /**
   * Автоматизированная пред функции
   * @returns Будет вторая таблица в которой будут все просрочники
   * Будет работать как простой GetAll с Соглашениями
   */
  async getAllAgreementOverdue() {
    return;
  }
}
