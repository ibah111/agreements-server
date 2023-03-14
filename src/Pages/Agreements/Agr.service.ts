import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { LawAct, Person } from '@contact/models';
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
    @InjectModel(Person, 'contact')
    private readonly modelPerson: typeof Person,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
  ) {}
  async getAgreementWith() {
    const Agreements = await this.modelAgreement.findAll({
      limit: 25,
    });
    for (const item of Agreements) {
      const data = <Agreement>item.dataValues;
      data.LawAct = <LawAct>await this.modelLawAct.findByPk(data.r_law_act_id, {
        rejectOnEmpty: true,
        include: [
          'Debt',
          { model: this.modelPerson, attributes: ['f', 'i', 'o'] },
        ],
      });
    }
    return Agreements;
  }
  async CreateAgreement(data: CreateAgreementInput) {
    await this.modelLawAct.findByPk(data.r_law_act_id, {
      rejectOnEmpty: new NotFoundException('Дело не найдено'),
    });

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
