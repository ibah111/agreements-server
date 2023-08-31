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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as a from 'colors';
import { round } from '../../utils/round';

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
    return await personPreview.update(ContactPerson);
  }

  /**
   * Обновление согласа целиком
   * @param id_agreement соглас
   * @param link_debts связанные долги
   * @returns апдейт обновленных данных
   */
  async updateCurrentAgreement(id_agreement: number) {
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

    if (link_debts)
      for (const link of link_debts) {
        const debt = await link?.getDebt({
          include: [
            { association: 'LastCalcs' },
            {
              required: false,
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
          before_agreement: round(_.sumBy(calcs_before_agreement, 'sum')), // 1 - переменная, 2 - по которому суммируем
          first_payment: first_payment?.sum || null,
          first_payment_date: first_payment?.calc_date || null,
          last_payment: last_payment?.sum || null,
          last_payment_date: last_payment?.calc_date || null,
          sum_payments: round(_.sumBy(calculations_in_agreements, 'sum')),
          payable_status:
            (debt.LastCalcs?.length && debt.LastCalcs?.length > 0) || false,
          portfolio: debt.r_portfolio_id,
          status: debt.status,
        };
        try {
          await link.update(data);
          await agreement.update({
            debt_count: link_debts.length,
          });
          if (link_debts.some((item) => item.payable_status === true)) {
            await agreement.update({ payable_status: true });
          } else {
            await agreement.update({ payable_status: false });
          }
        } catch (error) {
          console.log(`Error: ${error}`.red);
          throw error;
        }
      }
  }

  syncDebts() {
    return from(this.modelAgreementDebtLink.findAll()).pipe(
      mergeMap((items) =>
        of(...items).pipe(
          mergeMap((item) =>
            from(this.updateCurrentAgreement(item.id_agreement)).pipe(
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
  async syncPreview() {
    const sync = this.syncDebts().pipe(mergeMap(() => this.syncAgreements()));

    return sync;
  }
}
