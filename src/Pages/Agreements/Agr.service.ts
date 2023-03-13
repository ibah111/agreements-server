import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { LawAct } from '@contact/models';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { CreateAgreementInput } from './Agr.input';

export class AgreementsService {
  /**
   * нужны ли здесь caslAbility
   * на read
   */
  constructor(
    @InjectModel(LawAct, 'contact')
    private readonly modelLawAct: typeof LawAct,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
  ) {}
  async getUsers() {
    const Agreements = await this.modelAgreement.findAll({
      attributes: [
        'id',
        'last_check_date',
        'conclusion_date',
        'purpose',
        'court_sum',
        'debt_sum',
        'recalculation_sum',
        'discount_sum',
        'month_pay_day',
        'reg_doc',
        'finish_doc',
        'actions_for_get',
        'comment',
        'task_link',
      ],
      limit: 25,
    });
    for (const item of Agreements) {
      const data = <Agreement>item.dataValues;
      data.LawAct = <LawAct>await this.modelLawAct.findByPk(data.r_law_act_id, {
        rejectOnEmpty: true,
      });
    }
    return Agreements;
  }
  async CreateAgreement(data: CreateAgreementInput) {
    const Agreement = await this.modelAgreement.create(data);
    return Agreement;
  }
  async getAgreement(index: number) {
    const Agreement = await this.modelAgreement.findByPk(index, {
      rejectOnEmpty: new NotFoundException(
        'Соглашения не найдено. Возможно оно не существует',
      ),
    });
    return Agreement;
  }
  async deleteAgreement(index: number) {
    const Agreement = await this.modelAgreement.findByPk(index, {
      rejectOnEmpty: new NotFoundException(
        'Соглашение не найдено и не удалено',
      ),
    });
    await Agreement.destroy();
    return { result: 'success' };
  }
}
