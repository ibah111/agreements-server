import { Debt, DebtCalc } from '@contact/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Op, Sequelize } from '@sql-tools/sequelize';
import moment from 'moment';
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
  getTimeStepPayments(agreement: Agreement, agreementId: number) {
    const Agreement = this.modelAgreement.findByPk(agreementId, {
      include: 'DebtLinks',
      rejectOnEmpty: new NotFoundException(
        'Соглашения не найдено. Возможно оно не существует',
      ),
    });
    const debtId = agreement.DebtLinks?.map((item) => item.Debt?.id);
    const timeQuery = Sequelize.literal(
      `SELECT * FROM debt_calc WHERE parent_id = ${debtId} and dt >= DATEADD(month, -2, GETDATE())`,
    );
    return [timeQuery, Agreement];
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
  async checkAgreementOverdue(id: number) {
    const agreement = await this.modelAgreement.findOne({
      where: { id },
      include: ['DebtLinks'],
      rejectOnEmpty: true,
    });
    const debtIds = agreement.DebtLinks?.map(
      (item) => item.id_debt,
    ) as number[];
    const cd = agreement.conclusion_date;
    const searchAllOverdue = await this.modelDebt.findAll({
      attributes: [],
      where: { id: { [Op.in]: debtIds } },
      include: {
        where: {
          dt: {
            [Op.gte]: Sequelize.fn(
              'DATEADD',
              Sequelize.literal('month'),
              -2,
              moment().toDate(),
            ),
          },
        },
        model: this.modelDebtCalc,
      },
    });
    return [searchAllOverdue, cd];
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
