import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Debt,
  DebtCalc,
  LawAct,
  Person,
  PersonProperty,
} from '@contact/models';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { CreateAgreementInput, EditAgreementInput } from './Agr.input';
import {
  ActionLog,
  Actions,
} from 'src/Modules/Database/Local.Database/models/ActionLog';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { Op } from '@sql-tools/sequelize';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { AgrGetAllDto } from './Agr.dto';
import moment from 'moment';
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
    @InjectModel(AgreementDebtsLink, 'local')
    private readonly modelAgreementDebtsLink: typeof AgreementDebtsLink,
    @InjectModel(Debt, 'contact') private readonly modelDebt: typeof Debt,
  ) {}

  async getAll(): Promise<AgrGetAllDto[]> {
    const agreements = (await this.modelAgreement.findAll({
      limit: 25,
      include: [this.modelAgreementDebtsLink],
    })) as unknown as AgrGetAllDto[];

    const personIdArray: number[] = [];
    const debtIdArray: number[] = [];
    for (const agreement of agreements) {
      personIdArray.push(agreement.personId);
      for (const debtLink of agreement.DebtLinks || []) {
        debtIdArray.push(debtLink.id_debt);
      }
    }

    const debts = (await this.modelDebt.findAll({
      where: { id: { [Op.in]: debtIdArray } },
      include: ['DebtCalcs'],
    })) as Debt[];

    const persons = await this.modelPerson.findAll({
      where: { id: { [Op.in]: personIdArray } },
      attributes: ['fio', 'id', 'f', 'i', 'o'],
    });
    //Перебираем соглашения и добавляем данные
    for (const agreement of agreements) {
      //Присоединяем Person
      const dataValuesAgreement = agreement.dataValues as AgrGetAllDto;
      const person = persons.find((person) => person.id === agreement.personId);
      if (person) {
        dataValuesAgreement.Person = person as Person;
      }
      //Присоединяем Debt
      for (const debtLink of agreement.DebtLinks || []) {
        const dataValuesLink = debtLink.dataValues as AgreementDebtsLink;
        dataValuesLink.Debt = debts.find(
          (debt) => debt.id === debtLink.id_debt,
        );
        debtLink.Debt = dataValuesLink.Debt;
      }

      //Достаём все истории всех платежей
      const dcd = (agreement.DebtLinks?.map(
        (item) => item.Debt?.DebtCalcs || [],
      ) || []) as DebtCalc[][];
      const dc = ([] as DebtCalc[]).concat(...dcd);

      const calcs = dc.filter(
        (item) =>
          moment(agreement.conclusion_date).isBefore(moment(item.dt)) &&
          moment(agreement.finish_date || undefined).isAfter(moment(item.dt)),
      );

      const sum = calcs
        .map((item) => item.sum)
        .reduce((prev, curr) => {
          return prev + curr;
        }, 0);
      dataValuesAgreement.sumAfterAgr = sum;
      const lp = null;
      dataValuesAgreement.lastPayment = lp;
      const fp = null;
      dataValuesAgreement.firstPayment = fp;
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
    const agreement = await this.modelAgreement.findByPk(id, {
      rejectOnEmpty: new NotFoundException('Запись не найдена'),
    });
    const old = agreement[data.field];
    agreement[data.field] = data.value;
    const changed = agreement.changed();
    await agreement.save();
    await this.modelActionLog.create({
      actionType: Actions.UPDATE,
      row_id: id,
      field: data.field,
      old_value: String(old),
      new_value: String(data.value),
      user: auth.userLocal.id,
    });
    return Boolean(changed);
  }
}
