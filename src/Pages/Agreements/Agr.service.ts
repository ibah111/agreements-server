import { Injectable, NotFoundException } from '@nestjs/common';
import { Debt, DebtCalc, LawExec, Person, Portfolio } from '@contact/models';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import {
  AgreementsAll,
  CreateAgreementInput,
  EditAgreementInput,
} from './Agr.input';
import {
  ActionLog,
  Actions,
} from 'src/Modules/Database/Local.Database/models/ActionLog';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { Attributes, Op } from '@sql-tools/sequelize';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { AgrGetAllDto } from './Agr.dto';
import moment from 'moment';
import getSize from 'src/utils/getSize';
import { getUtils } from 'src/utils/Columns/Agreements/utils/getUtils';
import { combineLatestAll, from, map, mergeMap, of } from 'rxjs';

@Injectable()
export class AgreementsService {
  /**
   * нужны ли здесь caslAbility
   * на read
   */
  constructor(
    @InjectModel(Person, 'contact')
    private readonly modelPerson: typeof Person,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(ActionLog, 'local')
    private readonly modelActionLog: typeof ActionLog,
    @InjectModel(AgreementDebtsLink, 'local')
    private readonly modelAgreementDebtsLink: typeof AgreementDebtsLink,
    @InjectModel(Debt, 'contact') private readonly modelDebt: typeof Debt,
    @InjectModel(LawExec, 'contact')
    private readonly modelLawExec: typeof LawExec,
    @InjectModel(Portfolio, 'contact')
    private readonly modelPortfolio: typeof Portfolio,
  ) {}
  getPortfolios() {
    return from(
      this.modelPortfolio.findAll({
        attributes: ['id', 'name'],
        raw: true,
        where: { status: 2 },
      }),
    );
  }
  async getAll(body: AgreementsAll) {
    const size = getSize(body.paginationModel.pageSize);
    const utils = getUtils();
    const filter = utils.generateFilter(body.filterModel);
    const agreements_ids = await this.modelAgreement.findAll({
      attributes: ['id', 'personId'],
      raw: true,
      where: filter('Agreement'),
    });
    const persons_ids = (
      await this.modelPerson.findAll({
        raw: true,
        where: {
          [Op.and]: [
            {
              id: {
                [Op.in]: agreements_ids.map((agreement) => agreement.personId),
              },
            },
            filter('Person'),
          ],
        },
      })
    ).map((person) => person.id);
    const agreements = (await this.modelAgreement.findAndCountAll({
      offset: body.paginationModel.page * size,
      limit: size,
      where: {
        [Op.and]: [
          { id: { [Op.in]: agreements_ids.map((agreement) => agreement.id) } },
          { personId: { [Op.in]: persons_ids } },
        ],
      },
      include: [{ model: this.modelAgreementDebtsLink, separate: true }],
    })) as unknown as { count: number; rows: AgrGetAllDto[] };

    const personIdArray: number[] = [];
    const debtIdArray: number[] = [];
    for (const agreement of agreements.rows) {
      personIdArray.push(agreement.personId);
      for (const debtLink of agreement.DebtLinks || []) {
        debtIdArray.push(debtLink.id_debt);
      }
    }
    const debts = (await this.modelDebt.findAll({
      where: { id: { [Op.in]: debtIdArray } },
      include: [
        {
          model: this.modelPortfolio,
          attributes: ['id', 'name'],
        },
        {
          association: 'DebtCalcs',
        },
      ],
    })) as Debt[];
    const persons = await this.modelPerson.findAll({
      where: { id: { [Op.in]: personIdArray } },
      include: [
        {
          association: 'Debts',
        },
      ],
      attributes: ['fio', 'id', 'f', 'i', 'o'],
    });
    //Перебираем соглашения и добавляем данные
    for (const agreement of agreements.rows) {
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

      //ALSO Расчет платежей на дату после заключения соглашения
      const calcs = dc
        .filter(
          (item) =>
            moment(agreement.conclusion_date).isBefore(moment(item.dt)) &&
            moment(agreement.finish_date || undefined).isAfter(moment(item.dt)),
        )
        .sort((a, b) => moment(a.dt).diff(moment(b.dt)));

      // расчет на сумму до соглашения
      const calcsBefore = dc.filter((item) =>
        moment(agreement.conclusion_date).isAfter(moment(item.dt)),
      );
      const sumBefore = calcsBefore
        .map((item) => item.sum)
        .reduce((prev, curr) => {
          return prev + curr;
        }, 0);

      dataValuesAgreement.sumBeforeAgr = sumBefore;
      // сумма платежей после соглашения
      const sum = calcs
        .map((item) => item.sum)
        .reduce((prev, curr) => {
          return prev + curr;
        }, 0);
      dataValuesAgreement.sumAfterAgr = sum;

      if (calcs.length !== 0) {
        // lp - lastPayment расчет последнего платежа
        const lp = calcs[calcs.length - 1];
        const sumLP = lp.sum;
        dataValuesAgreement.lastPayment = sumLP;
        // lpdate - дата последняя
        const lpdate = lp.dt;
        dataValuesAgreement.lastPaymentDate = lpdate;
        // fp - frstPayment расчет первого платежа
        const fp = calcs[0];
        const sumFP = fp.sum;
        dataValuesAgreement.firstPayment = sumFP;
        // fpdate - дата первого платежа
        const fpdate = fp.dt;
        dataValuesAgreement.firstPaymentDate = fpdate;
      }
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
      include: { model: this.modelAgreementDebtsLink },
      rejectOnEmpty: new NotFoundException(
        'Соглашение не найдено и не удалено',
      ),
    });
    await this.modelActionLog.create({
      actionType: Actions.DELETE,
      row_id: Agreement.id,
      user: auth.userLocal.id,
    });
    for (const debtLink of Agreement.DebtLinks || []) {
      await debtLink.destroy();
    }
    await Agreement.destroy();
    return { result: 'success' };
  }

  async deleteSelectedAgreements(idArray: number[]) {
    let count = 0;
    for (const id of idArray) {
      count += await this.modelAgreement.destroy({ where: { id: id } });
    }
    return [count, idArray];
  }

  editAgreement(auth: AuthResult, id: number, data: EditAgreementInput) {
    /**
     * ретурн
     */
    return from(
      this.modelAgreement.findByPk(id, {
        rejectOnEmpty: new NotFoundException('Запись не найдена'),
      }),
    ).pipe(
      mergeMap((agreement) => {
        for (const key of Object.keys(
          data,
        ) as (keyof Attributes<Agreement>)[]) {
          agreement[key] = data[key];
        }
        const changed = agreement.changed() as
          | (keyof Attributes<Agreement>)[]
          | false;
        if (!changed) return of(agreement);
        /**
         * Условия второго статуса
         */
        if (data['statusAgreement'] === 2) {
          agreement.finish_date = new Date();
        }
        return of(...changed).pipe(
          map((field) =>
            this.modelActionLog.create({
              actionType: Actions.UPDATE,
              row_id: id,
              field: field,
              old_value: String(agreement.previous(field)),
              new_value: String(data[field]),
              user: auth.userLocal.id,
            }),
          ),
          combineLatestAll(),
          mergeMap(() => agreement.save()),
          map((agreement) => agreement),
        );
      }),
    );
  }
}
