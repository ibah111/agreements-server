import { Injectable, NotFoundException } from '@nestjs/common';
import { Debt, LawExec, Person, Portfolio } from '@contact/models';
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
import { Attributes, Op, Sequelize } from '@sql-tools/sequelize';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { AgrGetAllDto } from './Agr.dto';
import getSize from 'src/utils/getSize';
import { getUtils } from 'src/utils/Columns/Agreements/utils/getUtils';
import { combineLatestAll, from, map, mergeMap, of } from 'rxjs';
import { agreementCalculation } from './Agr.functions/agreementCalculations';

@Injectable()
export class AgreementsService {
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
      attributes: ['id', 'person_id'],
      raw: true,
      where: filter('Agreement'),
    });
    const filterPayable = body.filterModel.items.find(
      (item) => item.field === 'payableStatus',
    );
    const persons_ids = (
      await this.modelPerson.findAll({
        raw: true,
        attributes: ['id'],
        // logging: true,
        where: {
          [Op.and]: [
            {
              id: {
                [Op.in]: agreements_ids.map((agreement) => agreement.person_id),
              },
            },
            filter('Person'),
          ],
        },
        include: [
          {
            association: 'Debts',
            where: filter('Debt'),
            required: true,
            attributes: [],
            include: [
              {
                association: 'LastCalcs',
                attributes: [],
              },
            ],
          },
        ],
        group: ['Person.id'],
        having: filterPayable?.value
          ? Sequelize.where(
              Sequelize.fn('COUNT', Sequelize.col('Debts.LastCalcs.id')),
              filterPayable.value === 'true' ? { [Op.gt]: 0 } : { [Op.eq]: 0 },
            )
          : undefined,
      })
    ).map((person) => person.id);
    const agreements = (await this.modelAgreement.findAndCountAll({
      offset: body.paginationModel?.page * size,
      limit: size,
      where: {
        [Op.and]: [
          { id: { [Op.in]: agreements_ids.map((agreement) => agreement.id) } },
          { person_id: { [Op.in]: persons_ids } },
        ],
      },
      include: [{ model: this.modelAgreementDebtsLink, separate: true }],
    })) as unknown as { count: number; rows: AgrGetAllDto[] };

    const personIdArray: number[] = [];
    const debtIdArray: number[] = [];
    for (const agreement of agreements.rows) {
      personIdArray.push(agreement.person_id);
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
        {
          association: 'LastCalcs',
          required: false,
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
      const person = persons.find(
        (person) => person.id === agreement.person_id,
      );
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
      agreementCalculation(agreement);
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
  async addDataContact(agreement: Agreement) {
    const debtIdArray: number[] = [];
    for (const link of agreement?.DebtLinks || []) {
      debtIdArray.push(link.id_debt);
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
    const person = await this.modelPerson.findOne({
      where: { id: agreement?.person_id },
      include: [
        {
          association: 'Debts',
        },
      ],
      attributes: ['fio', 'id', 'f', 'i', 'o'],
    });
    //Присоединяем Person
    const dataValuesAgreement = agreement.dataValues as AgrGetAllDto;
    if (person) {
      dataValuesAgreement.Person = person as Person;
    }
    //Присоединяем Debt
    for (const debtLink of agreement.DebtLinks || []) {
      const dataValuesLink = debtLink.dataValues as AgreementDebtsLink;
      dataValuesLink.Debt = debts.find((debt) => debt.id === debtLink.id_debt);
      debtLink.Debt = dataValuesLink.Debt;
    }
    return agreement;
  }

  async editAgreement(auth: AuthResult, id: number, data: EditAgreementInput) {
    return from(
      this.modelAgreement.findByPk(id, {
        include: ['DebtLinks'],
        rejectOnEmpty: new NotFoundException('Запись не найдена'),
      }),
    ).pipe(
      mergeMap((agr) => this.addDataContact(agr)),
      mergeMap((agreement) => {
        for (const key of Object.keys(
          data,
        ) as (keyof Attributes<Agreement>)[]) {
          agreement[key] = data[key];
        }
        const changed = agreement.changed() as
          | (keyof Attributes<Agreement>)[]
          | false;
        if (!changed)
          return of(agreement).pipe(map((agr) => agreementCalculation(agr)));
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
          map((agr) => agreementCalculation(agr)),
        );
      }),
    );
  }
}
