import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
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
import { Payments } from '../Database/Local.Database/models/Payments';
import { ScheduleLinks } from '../Database/Local.Database/models/SchedulesLinks';

@Injectable()
export class PreviewGeneratorService implements OnModuleInit {
  constructor(
    @InjectModel(PersonPreview, 'local')
    private readonly modelPersonPreview: typeof PersonPreview,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(AgreementDebtsLink, 'local')
    private readonly modelAgreementDebtLink: typeof AgreementDebtsLink,
    @InjectModel(Person, 'contact') private readonly modelPerson: typeof Person,
    @InjectModel(ScheduleLinks, 'local')
    private readonly modelScheduleLinks: typeof ScheduleLinks,
    @InjectModel(Payments, 'local')
    private readonly modelPayments: typeof Payments,
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
   * Проверяет платежесность дожлника
   * проверяет/меняет статус у СОГЛАШЕНИЯ
   * @TODO сделать смену статус по долгу
   */
  async checkPayableStatus(id: number) {
    const agr = await this.modelAgreement.findOne({
      where: {
        id,
      },
    });
    /**
     * массив id'шников
     */
    if (!agr) return 'Такое вряд-ли возможно';
    const schedules = await this.modelScheduleLinks.findAll({
      where: {
        id_agreement: agr.id,
      },
    });
    console.log(schedules.map((i) => i.id));
    for (const schedule of schedules) {
      const payments = await this.modelPayments.findAll({
        where: {
          id_schedule: schedule.id,
        },
      });

      const lastEl = payments[payments.length - 1];
      /**
       * Этот блок кода выдает ошибку при отсутсвии
       * связанного долга
       */
      const AgrDebtLink = await this.modelAgreementDebtLink.findOne({
        where: { id_debt: schedule.id },
      });
      if (!AgrDebtLink)
        throw Error('Привязка долга не существует, свяжите долг');

      if (lastEl.status === false) {
      } else {
        AgrDebtLink?.payable_status === true;
        AgrDebtLink.save;
      }
    }
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

        const cd_date = link.Agreement!.conclusion_date;
        const fd_date = link.Agreement?.finish_date || undefined;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const calculations_in_agreements = debt.DebtCalcs!.filter(
          (item) =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            moment(cd_date).startOf('day').isBefore(moment(item.calc_date)) &&
            moment(fd_date).endOf('day').isAfter(moment(item.calc_date)),
        );

        const calcs_before_agreement = calculations_in_agreements.filter(
          (item) =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            moment(link.Agreement!.conclusion_date).isAfter(
              moment(item.calc_date),
            ),
        );
        const first_payment = _.minBy(calculations_in_agreements, 'calc_date');
        const last_payment = _.maxBy(calculations_in_agreements, 'calc_date');
        const data: PreviewDebt = {
          contract: debt.contract,
          before_agreement: _.floor(_.sumBy(calcs_before_agreement, 'sum'), 2), // 1 - переменная, 2 - по которому суммируем
          first_payment: first_payment?.sum || null,
          first_payment_date: first_payment?.calc_date || null,
          last_payment: last_payment?.sum || null,
          last_payment_date: last_payment?.calc_date || null,
          sum_payments: _.floor(_.sumBy(calculations_in_agreements, 'sum'), 2),
          /**
           * @todo
           */
          payable_status: false,
          portfolio: debt.r_portfolio_id,
          status: debt.status,
          name: debt.name,
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
  syncPreview() {
    const sync = this.syncDebts().pipe(mergeMap(() => this.syncAgreements()));
    return sync;
  }
  onModuleInit() {
    return this.syncPreview();
  }
}
