import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { PersonPreview } from '../Database/Local.Database/models/PersonPreview';
import { Agreement } from '../Database/Local.Database/models/Agreement';
import { DebtCalc, Person } from '@contact/models';
import AgreementDebtsLink, {
  PreviewDebt,
} from '../Database/Local.Database/models/AgreementDebtLink';
import { MIS, WhereOptions } from '@sql-tools/sequelize';
import moment from 'moment';
import _ from 'lodash';
import { catchError, from, last, mergeMap, of } from 'rxjs';
interface InputPreview {
  id_debt: number;
  id_agreement: number;
}
@Injectable()
export class PreviewGeneratorService {
  constructor(
    @InjectModel(PersonPreview, 'local')
    private readonly modelPersonPreview: typeof PersonPreview,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(AgreementDebtsLink, 'local')
    private readonly modelAgreementDebtLink: typeof AgreementDebtsLink,
    @InjectModel(Person, 'contact') private readonly modelPerson: typeof Person,
  ) {}
  /**
   *
   * @param agreement_id
   * @returns
   */
  async generateAgreementPreview(agreement_id: number | MIS<Agreement>) {
    const agreement =
      agreement_id instanceof Agreement
        ? agreement_id
        : await this.modelAgreement.findOne({
            where: { id: agreement_id },
          });

    if (!agreement) return;
    const ContactPerson = await this.modelPerson.findOne({
      raw: true,
      attributes: ['birth_date', 'f', 'i', 'o'],
      where: { id: agreement.person_id },
      rejectOnEmpty: new NotFoundException(),
    });

    const [personPreview, created] = await this.modelPersonPreview.findOrCreate(
      {
        where: { person_id: agreement.person_id },
        defaults: { person_id: agreement.person_id, ...ContactPerson },
      },
    );
    if (created) return personPreview;
    return personPreview.update(ContactPerson);
  }
  /**
   * @param data
   * @returns превью debt'а
   */
  async generateDebtPreview({ id_debt, id_agreement }: InputPreview) {
    const link = await this.modelAgreementDebtLink.findOne({
      where: { id_debt, id_agreement },
      include: {
        required: true,
        association: 'Agreement',
        attributes: ['conclusion_date', 'finish_date'],
      },
      rejectOnEmpty: new NotFoundException(),
    });
    const debt = await link?.getDebt({
      include: [
        { association: 'LastCalcs' },
        {
          required: false, // debt_calc может быть пустой, при связке может выдать error-500
          association: 'DebtCalcs',
          where: { is_confirmed: 1, is_cancel: 0 } as WhereOptions<DebtCalc>,
        },
      ],
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const calculations_in_agreements = debt.DebtCalcs!.filter(
      (item) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        moment(link.Agreement!.conclusion_date)
          .startOf('day')
          .isBefore(moment(item.calc_date)) &&
        moment(link.Agreement?.finish_date || undefined)
          .endOf('day')
          .isAfter(moment(item.calc_date)),
    );
    const calcs_before_agreement = calculations_in_agreements.filter((item) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      moment(link.Agreement!.conclusion_date).isAfter(moment(item.dt)),
    );
    const first_payment = _.minBy(calculations_in_agreements, 'calc_date');
    const last_payment = _.maxBy(calculations_in_agreements, 'calc_date');
    const data: PreviewDebt = {
      contract: debt.contract,
      before_agreement: _.sumBy(calcs_before_agreement, 'sum'), // 1 - переменная, 2 - по которому суммируем
      first_payment: first_payment?.sum || null,
      first_payment_date: first_payment?.calc_date || null,
      last_payment: last_payment?.sum || null,
      last_payment_date: last_payment?.calc_date || null,
      sum_payments: _.sumBy(calculations_in_agreements, 'sum'),
      payable_status:
        (debt.LastCalcs?.length && debt.LastCalcs?.length > 0) || false,
      portfolio: debt.r_portfolio_id,
      status: debt.status,
    };
    link.update(data);
    const agreement = await this.modelAgreement.findOne({
      where: { id: id_agreement },
    });
    agreement?.update({
      payable_status: data.payable_status,
    });
  }

  /**
   *
   * @param id_agreement соглас
   * @param link_debts связанные долги
   * @returns апдейт обновленных данных
   */
  async updateCurrentAgreement(id_agreement: number) {
    /**
     * @agrs
     */
    const agreement = await Agreement.findOne({
      where: {
        id: id_agreement,
      },
    });
    if (!agreement) return;
    const ContactPerson = await this.modelPerson.findOne({
      raw: true,
      attributes: ['birth_date', 'f', 'i', 'o'],
      where: { id: agreement.person_id },
      rejectOnEmpty: new NotFoundException(),
    });
    const [personPreview, created] = await this.modelPersonPreview.findOrCreate(
      {
        where: { person_id: agreement.person_id },
        defaults: { person_id: agreement.person_id, ...ContactPerson },
      },
    );
    if (created) return personPreview;
    /**
     * @LINKS
     */
    const link_debts = await this.modelAgreementDebtLink.findAll({
      where: {
        id_agreement: id_agreement,
      },
      include: {
        required: true,
        association: 'Agreement',
        attributes: ['conclusion_date', 'finish_date'],
      },
    });
    /**
     * @if если у согласа есть долги => пробегаемся по ним
     */

    if (link_debts)
      /**
       * Апдейт по долгу
       */
      for (const link of link_debts) {
        const debt = await link?.getDebt({
          include: [
            { association: 'LastCalcs' },
            {
              required: false, // debt_calc может быть пустой, при связке может выдать error-500
              association: 'DebtCalcs',
              where: {
                is_confirmed: 1,
                is_cancel: 0,
              } as WhereOptions<DebtCalc>,
            },
          ],
        });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const calculations_in_agreements = debt.DebtCalcs!.filter(
          (item) =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            moment(link.Agreement!.conclusion_date)
              .startOf('day')
              .isBefore(moment(item.calc_date)) &&
            moment(link.Agreement?.finish_date || undefined)
              .endOf('day')
              .isAfter(moment(item.calc_date)),
        );
        const calcs_before_agreement = calculations_in_agreements.filter(
          (item) =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            moment(link.Agreement!.conclusion_date).isAfter(moment(item.dt)),
        );
        const first_payment = _.minBy(calculations_in_agreements, 'calc_date');
        const last_payment = _.maxBy(calculations_in_agreements, 'calc_date');
        const data: PreviewDebt = {
          contract: debt.contract,
          before_agreement: _.sumBy(calcs_before_agreement, 'sum'), // 1 - переменная, 2 - по которому суммируем
          first_payment: first_payment?.sum || null,
          first_payment_date: first_payment?.calc_date || null,
          last_payment: last_payment?.sum || null,
          last_payment_date: last_payment?.calc_date || null,
          sum_payments: _.sumBy(calculations_in_agreements, 'sum'),
          payable_status:
            (debt.LastCalcs?.length && debt.LastCalcs?.length > 0) || false,
          portfolio: debt.r_portfolio_id,
          status: debt.status,
        };

        link.update(data);
      }
    /**
     * я знаю что в теории этот кусок кода можно упростить, написав:
     * this.generateDebtPreview()
     * но по скольку если и этот сейчас работает, то желания менять
     * у меня нет
     */
    if (link_debts.some((item) => item.payable_status === true)) {
      agreement.update({ payable_status: true });
    } else {
      agreement.update({ payable_status: false });
    }
    /**
     * @returns
     */
    return personPreview.update(ContactPerson);
  }

  /**
   * методы сделаны для крона
   */
  syncDebts() {
    return from(this.modelAgreementDebtLink.findAll()).pipe(
      mergeMap((items) =>
        of(...items).pipe(
          mergeMap((item) =>
            from(this.generateDebtPreview(item)).pipe(
              catchError(() => this.writeError(item)),
            ),
          ),
        ),
      ),
      last(),
    );
  }
  syncAgreements() {
    return from(this.modelAgreement.findAll()).pipe(
      mergeMap((items) =>
        of(...items).pipe(
          mergeMap((item) =>
            from(this.generateAgreementPreview(item)).pipe(
              catchError(() => this.writeError(item)),
            ),
          ),
        ),
      ),
      last(),
    );
  }
  async writeError(data: Agreement | AgreementDebtsLink) {
    data.error = 1;
    await data.save();
  }
  syncPreview() {
    return this.syncDebts().pipe(mergeMap(() => this.syncAgreements()));
  }
}
