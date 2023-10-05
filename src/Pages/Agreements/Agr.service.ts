import { Injectable, NotFoundException } from '@nestjs/common';
import { Debt, Portfolio } from '@contact/models';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { CreateAgreementInput, EditAgreementInput } from './Agr.input';
import {
  ActionLog,
  Actions,
} from 'src/Modules/Database/Local.Database/models/ActionLog';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { Attributes, Op, Sequelize } from '@sql-tools/sequelize';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import getSize from 'src/utils/getSize';
import { combineLatestAll, from, map, mergeMap, of } from 'rxjs';
import { Comment } from '../../Modules/Database/Local.Database/models/Comment';
import { PreviewGeneratorService } from '../../Modules/PreviewGenerator/PreviewGenerator.service';
import { PersonPreview } from '../../Modules/Database/Local.Database/models/PersonPreview';
import { DataGridClass } from '../DataGridClass/DataGridClass';
import { getAgreementUtils } from '../../utils/Columns/Agreements/utils.Agreements/getUtils.Agreements';

@Injectable()
export class AgreementsService {
  constructor(
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(ActionLog, 'local')
    private readonly modelActionLog: typeof ActionLog,
    @InjectModel(AgreementDebtsLink, 'local')
    private readonly modelAgreementDebtsLink: typeof AgreementDebtsLink,
    @InjectModel(Debt, 'contact') private readonly modelDebt: typeof Debt,
    @InjectModel(Portfolio, 'contact')
    private readonly modelPortfolio: typeof Portfolio,
    @InjectModel(Comment, 'local')
    private readonly modelComment: typeof Comment,
    @InjectModel(PersonPreview, 'local')
    private readonly modelPersonPreview: typeof PersonPreview,
    private readonly previewGenerator: PreviewGeneratorService,
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
  async getAll(body: DataGridClass) {
    const size = getSize(body.paginationModel.pageSize);
    /**
     * agr
     */
    const agreementUtils = getAgreementUtils();
    const agreementFilter = agreementUtils.getFilter(
      'Agreement',
      body.filterModel,
    );
    /**
     * pers-prev
     */
    const filterPersonPreview = agreementUtils.getFilter(
      'PersonPreview',
      body.filterModel,
    );
    const sort = agreementUtils.getSort(body.sortModel || []);
    const commentKeys = Reflect.ownKeys(
      agreementUtils.getFilter('Comments', body.filterModel),
    );
    const dlFilter = agreementUtils.getFilter('DebtLinks', body.filterModel);
    const keys = Reflect.ownKeys(dlFilter);
    return await this.modelAgreement.findAndCountAll({
      include: [
        {
          association: 'PersonPreview',
          required: true,
          where: filterPersonPreview,
        },
        {
          required: keys.length === 0 ? false : true,
          association: 'DebtLinks',
          separate: keys.length === 0 ? true : false,
          where: dlFilter,
        },
        {
          required: commentKeys.length === 0 ? false : true,
          separate: commentKeys.length === 0 ? true : false,
          association: 'Comments',
          where: agreementUtils.getFilter('Comments', body.filterModel),
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(
              '(Agreement.sum - (select sum(sum_payments) from AgreementToDebtLink as ad where ad.id_agreement = Agreement.id))',
            ),
            'sum_remains',
          ],
        ],
      },
      where: agreementFilter,
      order: sort,
      limit: size,
    });
  }

  async getAgreement(id: number) {
    const Agreement = await this.modelAgreement.findByPk(id, {
      rejectOnEmpty: new NotFoundException(
        'Соглашения не найдено. Возможно оно не существует',
      ),
    });
    return Agreement;
  }

  /**
   * этот метод надо добавить в контроллер, и навесить на него крон
   * @returns updated agreements
   */
  syncronize() {
    const syncPreview = this.previewGenerator.syncPreview();
    return syncPreview;
  }
  singleSync(id_agreement: number) {
    const singleSync =
      this.previewGenerator.updateCurrentAgreement(id_agreement);
    return singleSync;
  }

  async сreateAgreement(auth: AuthResult, data: CreateAgreementInput) {
    const condition = (data: CreateAgreementInput): CreateAgreementInput => {
      if (!data.sum)
        return {
          ...data,
          payable_status: false,
          debt_count: 0,
          sum: data.full_req,
        };
      return { ...data, payable_status: false, debt_count: 0 };
    };
    const Agreement = await this.modelAgreement.create(condition(data));

    await this.previewGenerator.generateAgreementPreview(Agreement.id);

    if (data.comment) {
      await this.modelComment.create({
        id_agreement: Agreement.id,
        user: auth.userLocal.id,
        comment: data.comment,
      });
    }
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
        include: ['DebtLinks', 'Comments', 'PersonPreview'],
        rejectOnEmpty: new NotFoundException('Запись не найдена'),
      }),
    ).pipe(
      mergeMap((agr) => this.addDataContact(agr), 20),
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

  async findAllByPersonId(person_id: number) {
    return await this.modelAgreement.findAll({
      where: {
        person_id: person_id,
      },
      attributes: ['id'],
    });
  }
}
