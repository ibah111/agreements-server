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
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
import AgreementDebtsLink from './AgreementDebtLink';
import { TypeAgreement } from './AgreementType';
import { PurposeType } from './PurposeType';
import { RegDocType } from './RegDocType';
import { StatusAgreement } from './StatusAgreement';
import { Comment } from './Comment';
import AgreementToPersonProperties from './AgreementToPersonProperties';
import { PersonPreview } from './PersonPreview';
import { Max } from 'class-validator';
import { Payments } from './Payments';
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
   * Размер задолженности
   */
  @Column(DataType.MONEY)
  sum: number | null;
  /**
   * Дисконт
   */
  @Column(DataType.MONEY)
  discount: number | null;
  /**
   *  Полное требование
   */
  @Column(DataType.MONEY)
  full_req: number | null;
  /**
   * Число платежа каждого месяца
   */
  @Max(31)
  @Column(DataType.INTEGER)
  month_pay_day: number | null;
  /**
   * ИД
   */
  @ForeignKey(() => RegDocType)
  @Column(DataType.INTEGER)
  reg_doc: FK<number> | null;
  @BelongsTo(() => RegDocType)
  RegDocType?: BelongsToAttribute<NonAttribute<RegDocType>>;
  @Column(DataType.STRING)
  registrator: string | null;

  @Column(DataType.STRING)
  archive: string | null;
  /**
   * Взыскатель (строка из экселя)
   */
  @Column(DataType.STRING)
  collector: string | null;
  /**
   * Взыскатель id
   */
  @Column(DataType.INTEGER)
  collector_id: number | null;
  /**
   * Ссылка на задачу
   */
  @Column(DataType.STRING)
  task_link: string | null;
  /**
   * Id персоны
   */
  @AllowNull(false)
  @ForeignKey(() => PersonPreview)
  @Column(DataType.INTEGER)
  person_id: number;

  @BelongsTo(() => PersonPreview)
  PersonPreview?: NonAttribute<PersonPreview>;
  /**
   * Действия для получения листа
   */
  @Column(DataType.STRING)
  actions_for_get: string | null;
  /**
   * Дата получения листа
   */
  @Column(DataType.DATE)
  receipt_dt: Date | null;
  /**
   * Ссылки на долги
   */
  @HasMany(() => AgreementDebtsLink)
  DebtLinks?: NonAttribute<AgreementDebtsLink[]>;

  @HasMany(() => AgreementToPersonProperties)
  PersonPropertiesLinks?: NonAttribute<AgreementToPersonProperties[]>;
  /**
   * Комментарии
   *
   */
  @Column(DataType.STRING)
  comment: string | null;

  /**
   * Платежный статус
   */
  @Column(DataType.BOOLEAN)
  payable_status: boolean | null;

  /**
   * ошибка
   */
  @Column(DataType.INTEGER)
  error?: number | null;

  @HasMany(() => Comment)
  Comments?: NonAttribute<Comment[]>;
  /**
   * Статус соглашения
   */
  @ForeignKey(() => StatusAgreement)
  @Column(DataType.INTEGER)
  statusAgreement: FK<number> | null;
  @BelongsTo(() => StatusAgreement)
  StatusAgreement?: BelongsToAttribute<NonAttribute<StatusAgreement>>;

  @HasMany(() => Payments)
  Payments?: NonAttribute<Payments[]>;

  Person?: NonAttribute<Person>;
  Portfolio?: NonAttribute<Portfolio>;
}
