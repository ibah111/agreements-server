import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Debt, LawAct, Person, PersonProperty } from '@contact/models';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { CreateAgreementInput, EditAgreementInput } from './Agr.input';

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
    @InjectModel(Debt, 'contact')
    private readonly modelDebt: typeof Debt,
    @InjectModel(PersonProperty, 'contact')
    private readonly modelPersonProperty: typeof PersonProperty,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
  ) {}
  async getAll() {
    const Agreements = await this.modelAgreement.findAll({
      limit: 25,
    });
    for (const item of Agreements) {
      const data = <Agreement>item.dataValues;
      data.LawAct = <LawAct>await this.modelLawAct.findByPk(data.r_law_act_id, {
        rejectOnEmpty: true,
        include: [
          {
            model: this.modelDebt,
            include: [
              {
                model: this.modelPersonProperty,
                include: ['PersonPropertyParams'],
              },
            ],
          },
          {
            model: this.modelPerson,
            include: ['Debts'],
          },
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
  async getAgreement(id: number) {
    const Agreement = await this.modelAgreement.findByPk(id, {
      rejectOnEmpty: new NotFoundException(
        'Соглашения не найдено. Возможно оно не существует',
      ),
    });
    return Agreement;
  }
  async deleteAgreement(id: number) {
    const Agreement = await this.modelAgreement.findByPk(id, {
      rejectOnEmpty: new NotFoundException(
        'Соглашение не найдено и не удалено',
      ),
    });
    await Agreement.destroy();
    return { result: 'success' };
  }
  async editAgreement(id: number, data: EditAgreementInput) {
    const name = await this.modelAgreement.update(
      {
        [data.field]: data.value,
      },
      { where: { id } },
    );
    return true;
  }
}
