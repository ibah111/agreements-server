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
import { PaymentsService } from 'src/Pages/Payments/Payments.service';

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
    private readonly paymentsService: PaymentsService,
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
      include: [
        {
          model: this.modelScheduleLinks,
        },
      ],
      rejectOnEmpty: new NotFoundException(),
    });
    agreement.getAgreementType();
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
        /**
         * Действующее / исполненное
         */
        const conditionLastPayments = (
          agreement: Agreement,
          calcs: DebtCalc[],
        ): DebtCalc[] => {
          switch (agreement.statusAgreement) {
            case 1: {
              const calcs_in_agreement = calcs.filter((item) =>
                moment(cd_date).startOf('day').isBefore(moment(item.calc_date)),
              );
              return calcs_in_agreement;
            }
            case 2 || 3: {
              const calcs_in_agreement = calcs.filter(
                (item) =>
                  moment(cd_date)
                    .startOf('day')
                    .isBefore(moment(item.calc_date)) &&
                  moment(fd_date).endOf('day').isAfter(moment(item.calc_date)),
              );
              return calcs_in_agreement;
            }
            default: {
              return [];
            }
          }
        };
        const calcs_in_agr = debt.DebtCalcs || [];
        conditionLastPayments(agreement, calcs_in_agr);

        const calcs_before_agreement = conditionLastPayments(
          agreement,
          calcs_in_agr,
        ).filter((item) =>
          moment(link.Agreement!.conclusion_date).isAfter(
            moment(item.calc_date),
          ),
        );
        const first_payment = _.minBy(
          conditionLastPayments(agreement, calcs_in_agr),
          'calc_date',
        );
        const last_payment = _.maxBy(
          conditionLastPayments(agreement, calcs_in_agr),
          'calc_date',
        );
        /**
         * @return Платежная ответсвенность
         * Если метод ЧЕК упирается в то, что нет привязанных графиков
         * то всегда должен возвращать старый метод
         */
        const check = async (): Promise<boolean> => {
          const oldMethod: boolean =
            (debt.LastCalcs?.length && debt.LastCalcs?.length > 0) || false;
          const schedule_links = agreement.ScheduleLinks || [];
          if (schedule_links.length === 0) {
            console.log('Графиков нет');
            return oldMethod;
          }

          /**
           * Скачем по графикам
           */
          for (const schedule_link of schedule_links) {
            const payments = await this.modelPayments.findAll({
              where: {
                id_schedule: schedule_link.id,
              },
            });
            if (payments.length === 0) {
              /**
               * Если график ЕСТЬ, но нет ПЛАТЕЖЕЙ, все равно возвращает старый метод
               */
              console.log(
                'У графика нету платежей, оттакливаюсь от старого метода',
              );
              return oldMethod;
            } else if (payments.length > 0) {
              /**
               * если платежи в графике есть (длина массива больше нуля)
               */
              const iterationCount = payments.filter(
                (i) => i.status === true,
              ).length;
              let iteration = 0;

              const firstElement = payments[0];
              while (iteration !== iterationCount) {
                console.log('iteration: '.red, iteration);
                if (firstElement.status === true) {
                  payments.shift();
                  iteration++;
                }
              }
              agreement.update({
                payable_status: moment(firstElement.pay_day).isAfter(
                  moment().add(-1, 'month'),
                ),
              });
            }
          }
          return oldMethod;
        };
        const resultCheck = await check();
        /**
         * data update
         */
        const data: PreviewDebt = {
          contract: debt.contract,
          before_agreement: _.floor(_.sumBy(calcs_before_agreement, 'sum'), 2), // 1 - переменная, 2 - по которому суммируем
          first_payment: first_payment?.sum || null,
          first_payment_date: first_payment?.calc_date || null,
          last_payment: last_payment?.sum || null,
          last_payment_date: last_payment?.calc_date || null,
          sum_payments: _.floor(
            _.sumBy(conditionLastPayments(agreement, calcs_in_agr), 'sum'),
            2,
          ),
          /**
           * @todo
           * @old
           * (debt.LastCalcs?.length && debt.LastCalcs?.length > 0) || false,
           * @new
           * this.checkPayable
           */
          payable_status: resultCheck,
          portfolio: debt.r_portfolio_id,
          status: debt.status,
          name: debt.name,
        };
        class Parameters {
          id_debt: number;
          last_payment?: number | null;
          last_payment_date?: Date | null;
        }
        const parameters: Parameters[] = link_debts.map((i) => {
          const obj: Parameters = {
            id_debt: i.id_debt,
            last_payment: i.last_payment || null || undefined,
            last_payment_date: i.last_payment_date || null || undefined,
          };
          return obj;
        });

        const date_collection = parameters.map((i) => i.last_payment_date);
        /**
         * достает последнюю дату
         */
        // console.log(
        //   date_collection.filter((i) => {
        //     return i !== undefined;
        //   }),
        // );
        const latest_date = date_collection
          .filter((i) => {
            return i !== undefined;
          })
          .reduce((a, b) => (a! > b! ? a : b));
        // console.log(latest_date);
        const latest_parameters = parameters.find(
          (i) => i.last_payment_date === latest_date,
        );
        try {
          await link.update(data);
          // console.log('latest_date', latest_date);
          // console.log(
          //   'latest_parameters?.last_payment',
          //   latest_parameters?.last_payment,
          // );
          await agreement.update({
            debt_count: link_debts.length,
            preview_last_payment_date: latest_date,
            preview_last_payment_sum: latest_parameters?.last_payment || 0,
          });
          const schedule_ids = agreement.ScheduleLinks?.map((i) => i.id);
          if (!schedule_ids) return 'Графиков нет';
          for (const schedule_id of schedule_ids) {
            await this.paymentsService.updatePayments(schedule_id);
          }

          if (agreement.ScheduleLinks?.length === 0) {
            if (link_debts.some((item) => item.payable_status === true)) {
              await agreement.update({
                payable_status: true,
              });
            } else {
              await agreement.update({ payable_status: false });
            }
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
