/**
 * Contact exception data
 * Таблица Данных не подцепляемых из контакта
 */
// Это пиздец.... 🤔
import { Person } from '@contact/models';
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
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
import AgreementDebtsLink from './AgreementDebtLink';
import { PurposeType } from './PurposeType';
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
  @AllowNull(true)
  @Column(DataType.DATE)
  finish_date: Date | null;
  /**
   * Назначение
   */
  @AllowNull(false)
  @ForeignKey(() => PurposeType)
  @Column(DataType.INTEGER)
  purpose: FK<number>;
  @BelongsTo(() => PurposeType)
  PurposeType?: BelongsToAttribute<NonAttribute<PurposeType>>;
  /**
   * Cумма задолженности по суд.акту
   */
  @AllowNull(false)
  @Column(DataType.MONEY)
  court_sum: number;
  /**
   * Сумма задолженности ОД взысканная в пользу НБК / Вымпел
   */
  @AllowNull(false)
  @Column(DataType.MONEY)
  debt_sum: number;
  /**
   * Сумма задолженности по пересчету
   */
  @AllowNull(true)
  @Column(DataType.MONEY)
  recalculation_sum: number | null;
  /**
   * Дисконт
   */
  @AllowNull(true)
  @Column(DataType.MONEY)
  discount_sum: number | null;
  /**
   * Число платежа каждого месяца
   */
  @AllowNull(false)
  @Column(DataType.INTEGER)
  month_pay_day: number;
  /**
   * Наличие ИД
   */
  @AllowNull(true)
  @Default(false)
  @Column(DataType.BOOLEAN)
  reg_doc: CreationOptional<boolean>;
  /**
   * Комментарии
   */
  @AllowNull(true)
  @Column(DataType.STRING)
  comment: string | null;
  /**
   * Ссылка на задачу
   */
  @AllowNull(true)
  @Column(DataType.STRING)
  task_link: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  personId: number;

  Person?: NonAttribute<Person>;

  @Column(DataType.STRING)
  actions_for_get: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  receipt_dt: Date;

  @HasMany(() => AgreementDebtsLink)
  DebtLinks?: NonAttribute<AgreementDebtsLink[]>;
}
