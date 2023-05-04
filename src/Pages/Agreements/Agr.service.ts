import { Injectable, NotFoundException } from '@nestjs/common';
import { DebtCalc, LawAct, Person, PersonProperty } from '@contact/models';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { CreateAgreementInput, EditAgreementInput } from './Agr.input';
import {
  ActionLog,
  Actions,
} from 'src/Modules/Database/Local.Database/models/ActionLog';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { Op } from '@sql-tools/sequelize';
import moment from 'moment';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
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
    @InjectModel(PersonProperty, 'contact')
    private readonly modelPersonProperty: typeof PersonProperty,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(ActionLog, 'local')
    private readonly modelActionLog: typeof ActionLog,
  ) {}

  async getAll() {
    const agreements = await this.modelAgreement.findAll({
      limit: 25,
    });
    const personIdArray = agreements.map((agreement) => agreement.personId);
    const persons = await this.modelPerson.findAll({
      where: { id: { [Op.in]: personIdArray } },
      attributes: ['fio', 'id', 'f', 'i', 'o'],
    });

    // const dc: DebtCalc[] = [];
    // const sum = dc
    //   .filter(
    //     (item) =>
    //       moment(agreements[0].conclusion_date).isAfter(item.dt) &&
    //       moment(agreements[0].finish_date && undefined).isBefore(item.dt),
    //   )
    //   .map((item) => item.sum)
    //   .reduce((prev, curr) => {
    //     return prev + curr;
    //   }, 0);
    for (const agreement of agreements) {
      const person = persons.find((person) => person.id === agreement.personId);
      if (!person) continue;
      (agreement.dataValues as Agreement).Person = person as Person;
    }
    return agreements;
  }

  async getAgreement(id: number) {
    const Agreement = await this.modelAgreement.findByPk(id, {
      rejectOnEmpty: new NotFoundException(
        'Соглашения не найдено. Возможно оно не существует',
      ),
    });
    return Agreement;
  }

  async сreateAgreement(auth: AuthResult, data: CreateAgreementInput) {
    const Agreement = await this.modelAgreement.create(data);
    await this.modelActionLog.create({
      actionType: Actions.CREATE,
      row_id: Agreement.id,
      user: auth.userLocal.id,
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
