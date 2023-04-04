import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Debt, LawAct, Person, PersonProperty } from '@contact/models';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { CreateAgreementInput, EditAgreementInput } from './Agr.input';
import {
  ActionLog,
  Actions,
} from 'src/Modules/Database/Local.Database/models/ActionLog';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
@Injectable()
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
    @InjectModel(ActionLog, 'local')
    private readonly modelActionLog: typeof ActionLog,
  ) {}
  async getAll() {
    const Agreements = await this.modelAgreement.findAll({
      limit: 25,
    });
    for (const item of Agreements) {
      const data = <Agreement>item.dataValues;
      data.Debt = <Debt>await this.modelDebt.findByPk(data.r_debt_id, {
        rejectOnEmpty: true,
        include: [
          {
            model: this.modelDebt,
            include: [
              {
                model: this.modelPersonProperty,
                include: ['PersonPropertyParams'],
              },
              'DebtCalcs',
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
  async сreateAgreement(auth: AuthResult, data: CreateAgreementInput) {
    await this.modelLawAct.findByPk(data.r_debt_id, {
      rejectOnEmpty: new NotFoundException('Дело не найдено'),
    });

    const Agreement = await this.modelAgreement.create(data);
    await this.modelActionLog.create({
      actionType: Actions.CREATE,
      row_id: Agreement.id,
      user: auth.userLocal.id,
    });
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
  async deleteAgreement(auth: AuthResult, id: number) {
    const Agreement = await this.modelAgreement.findByPk(id, {
      rejectOnEmpty: new NotFoundException(
        'Соглашение не найдено и не удалено',
      ),
    });
    await this.modelActionLog.create({
      actionType: Actions.DELETE,
      row_id: Agreement.id,
      user: auth.userLocal.id,
    });
    await Agreement.destroy();
    return { result: 'success' };
  }
  async editAgreement(auth: AuthResult, id: number, data: EditAgreementInput) {
    const Agreement = await this.modelAgreement.findByPk(id, {
      rejectOnEmpty: new NotFoundException('Запись не найдена'),
    });
    const old = Agreement[data.field];
    Agreement[data.field] = data.value;
    await Agreement.save();
    await this.modelActionLog.create({
      actionType: Actions.UPDATE,
      row_id: id,
      field: data.field,
      old_value: old,
      new_value: String(data.value),
      user: auth.userLocal.id,
    });
    return true;
  }
}
