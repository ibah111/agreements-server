/**
 * Contact exception data
 * Таблица Данных не подцепляемых из контакта
 */

import { Person, Portfolio } from '@contact/models';

import {
  BelongsToAttribute,
  CreateLiteralAssociation,
} from '@sql-tools/association-literal';
import {
  CreationOptional,
  ForeignKey as FK,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from '@sql-tools/sequelize';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
import AgreementDebtsLink from './AgreementDebtLink';
import { TypeAgreement } from './AgreementType';
import { PurposeType } from './PurposeType';
import { RegDocType } from './RegDocType';
import { StatusAgreement } from './StatusAgreement';
@Table({ tableName: 'Agreements', paranoid: true })
export class Agreement extends Model<
  InferAttributes<Agreement>,
  InferCreationAttributes<Agreement>,
  CreateLiteralAssociation<Agreement>
> {
  /**
   * ID записи
   */
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.NUMBER)
  id: CreationOptional<number>;
  /**
   * Дата заключения
   */
  @AllowNull(false)
  @Column(DataType.DATE)
  conclusion_date: Date;
  /**
   * Конец соглашения
   */
  @Column(DataType.DATE)
  finish_date: Date | null;
  /**
   * Назначение
   */
  @ForeignKey(() => PurposeType)
  @Column(DataType.INTEGER)
  purpose: FK<number>;
  @BelongsTo(() => PurposeType)
  PurposeType?: BelongsToAttribute<NonAttribute<PurposeType>>;
  /**
   * Тип соглашения
   */
  @ForeignKey(() => TypeAgreement)
  @Column(DataType.INTEGER)
  agreement_type: FK<number>;
  @BelongsTo(() => TypeAgreement)
  AgreementType?: BelongsToAttribute<NonAttribute<TypeAgreement>>;
  /**
   * Сумма задолженности, переданная банком (эл. реестр)
   */
  @Column(DataType.MONEY)
  bank_sum: number;
  /**
   * Cумма задолженности по суд.акту
   */
  @Column(DataType.MONEY)
  court_sum: number | null;
  /**
   * Сумма задолженности ОД взысканная в пользу НБК / Вымпел
   */
  @Column(DataType.MONEY)
  debt_sum: number | null;
  /**
   * Сумма задолженности по пересчету
   */
  @Column(DataType.MONEY)
  recalculation_sum: number | null;
  /**
   * Дисконт
   */
  @Column(DataType.MONEY)
  discount_sum: number | null;
  /**
   * Статичный дисконт (никак не учавствует в расчетах, просто существует)
   */
  @Column(DataType.MONEY)
  discount: number | null;
  /**
   * Число платежа каждого месяца
   */
  @Column(DataType.INTEGER)
  month_pay_day: number;
  /**
   * Наличие ИД
   */
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  reg_doc: CreationOptional<boolean>;
  /**
   * новый ИД
   */
  @ForeignKey(() => RegDocType)
  @Column(DataType.INTEGER)
  new_regDoc: FK<number> | null;
  @BelongsTo(() => RegDocType)
  RegDocType?: BelongsToAttribute<NonAttribute<RegDocType>>;
  @Column(DataType.STRING)
  registrator: string | null;

  @Column(DataType.STRING)
  archive: string | null;
  /**
   * Комментарии
   */

  @Column(DataType.STRING)
  comment: string | null;
  /**
   * Ссылка на задачу
   */
  @Column(DataType.STRING)
  task_link: string | null;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  personId: number;

  @Column(DataType.STRING)
  actions_for_get: string | null;

  @Column(DataType.DATE)
  receipt_dt: Date | null;

  @HasMany(() => AgreementDebtsLink)
  DebtLinks?: NonAttribute<AgreementDebtsLink[]>;

  @ForeignKey(() => StatusAgreement)
  @Column(DataType.INTEGER)
  statusAgreement: FK<number> | null;
  @BelongsTo(() => StatusAgreement)
  StatusAgreement?: BelongsToAttribute<NonAttribute<StatusAgreement>>;

  Person?: NonAttribute<Person>;
  Portfolio?: NonAttribute<Portfolio>;
}
