/**
 * Contact exception data
 * Таблица Данных не подцепляемых из контакта
 */
import { LawAct } from '@contact/models';
import {
  BelongsToAttribute,
  CreateLiteralAssociation,
  HasManyAttribute,
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
import { ActionLog } from './ActionLog';
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
   * ID записи в Контакта
   */
  @AllowNull(false)
  @Column(DataType.INTEGER)
  r_law_act_id: FK<number>;
  LawAct?: BelongsToAttribute<NonAttribute<LawAct>>;
  /**
   * Дата последней проверки
   */
  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  last_check_date: Date;
  /**
   *
   * Дата заключения
   */
  @AllowNull(false)
  @Column(DataType.DATE)
  conclusion_date: Date;
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
  @Column(DataType.MONEY)
  recalculation_sum: number | null;
  /**
   * Дисконт
   */
  @Column(DataType.MONEY)
  discount_sum: number | null;
  /**
   * Число платежа каждого месяца
   */
  @AllowNull(false)
  @Column(DataType.INTEGER)
  month_pay_day: number;
  /**
   * Наличие ИД в регистраторе
   */
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  reg_doc: CreationOptional<boolean>;
  /**
   * Наличие ИД в архиве
   */
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  finish_doc: CreationOptional<boolean>;
  /**
   * Действия для получения или предъявления листа
   */
  @Column(DataType.STRING)
  actions_for_get: string | null;
  /**
   * Комментарии
   */
  @Column(DataType.STRING)
  comment: string | null;
  /**
   * Ссылка на задачу
   */
  @AllowNull(false)
  @Column(DataType.STRING)
  task_link: string;
  @HasMany(() => ActionLog)
  Logs?: HasManyAttribute<NonAttribute<ActionLog[]>, 'row_id'>;
}
