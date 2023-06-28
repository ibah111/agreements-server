import { Column } from 'exceljs';
/**
 *  ДЕЙСТВУЮЩИЕ
 */
export const runnedColumns: (Partial<Column> & { position: number })[] = [
  { key: 'id_debt', position: 3 },
  { key: 'conclusion_date', position: 5 },
  { key: 'fio', position: 6 },
  { key: 'birth_date', position: 7 },
  { key: 'purpose', position: 10 },
  { key: 'bank_sum', position: 11 },
  { key: 'court_sum', position: 12 },
  { key: 'debt_sum', position: 13 },
  { key: 'recalculation_sum', position: 14 },
  { key: 'discount_total', position: 15 }, // тотал ( который высчитывается)
  { key: 'discount_sum', position: 16 },
  { key: 'month_pay_day', position: 20 },
  { key: 'new_reg_doc', position: 25 },
  { key: 'registrator', position: 26 },
  { key: 'archive', position: 27 },
  { key: 'receipt_dt', position: 28 },
  { key: 'actions_for_get', position: 29 },
  { key: 'comment', position: 36 },
  { key: 'collector', position: 38 },
  { key: 'task_link', position: 39 },
];
/**
 * ИСПОЛНЕННЫЕ
 */
export const donedColumns: (Partial<Column> & { position: number })[] = [
  { key: '№', position: 1 },
  { key: 'id_dela', position: 2 }, // хз как по другому назвать
  { key: 'id_debt', position: 3 }, // id долга
  { key: 'last_check_date', position: 4 }, //ласт проверка
  { key: 'conclusion_date', position: 5 }, // дата заключения
  { key: 'fio', position: 6 }, // фио
  { key: 'birth_date', position: 7 }, // рождения должника
  { key: 'KD', position: 8 }, // кд
  { key: 'portfolio', position: 9 }, // портфель
  { key: 'purpose', position: 10 }, // назначение
  { key: 'bank_sum', position: 11 }, // сумма переданная банком
  { key: 'court_sum', position: 12 }, // судебная сумма
  { key: 'debt_sum', position: 13 }, // сумма долга
  { key: 'recalculation_sum', position: 14 }, // сумма пересчета
  { key: 'discount_total', position: 15 }, // тотал ( который высчитывается)
  { key: 'discount_sum', position: 16 }, // сумма дисконта
  { key: 'sumBeforeAgreement', position: 17 }, // сумма (платежей) после соглешния
  { key: 'firstPaymentAgreement', position: 18 }, //Дата поступления первого платежа по соглашения
  { key: 'firstSumPaymentAgreement', position: 19 }, //Сумма первого платежа по соглашению
  { key: 'month_pay_day', position: 20 }, // ежемесячная дата платежа (день в который должен придти платеж)
  { key: 'lastPaymentDate', position: 21 }, // дата последнего платежа
  { key: 'lastPaymentSum', position: 22 }, // сумма последнего платежа
  { key: 'totalSumAgreement', position: 23 }, // Общая сумма платежей поступивших по соглашению
  { key: 'restOfDueAfterLastPayment', position: 24 }, // Остаток задолженности после поступления последнего платежа
  { key: 'new_reg_doc', position: 25 }, // наличие ИД (новый рег док, потому что boolean (см. историю гита))
  { key: 'registrator', position: 26 }, // регистратор
  { key: 'archive', position: 27 }, // наличие в архиве
  { key: 'receipt_dt', position: 28 }, // дата получения листа
  { key: 'actions_for_get', position: 29 }, // действия для получения листа
  { key: 'limitationPeriod', position: 30 }, // Срок исковой давности
  { key: 'dateForceLawEntry', position: 31 }, // дата поступления в законную силу
  { key: 'id_submission_deadline', position: 32 }, // Срок предъявления ИД
  { key: 'registerCreditCount', position: 33 }, // Количество кредитов в реестра
  { key: 'guarantorCount', position: 34 }, // Наличие поручителей /правопреемников (наследников)
  { key: 'deposit_typ', position: 35 }, // Наличие залогового имущества
  { key: 'comment', position: 36 }, // коммент
  { key: 'status_debt', position: 37 }, // Статус долга
  { key: 'collector', position: 38 }, // Взыскатель
  { key: 'task_link', position: 39 }, // ссылка на задачу
];
/**
 * УТРАТИВШИЕ СИЛУ
 */
export const outOfStrengthColumns: (Partial<Column> & { position: number })[] =
  [
    { key: '№', position: 1 }, // A
    { key: 'id_dela', position: 2 }, // хз как по другому назвать B
    { key: 'id_debt', position: 3 }, // id долга C
    { key: 'last_check_date', position: 4 }, //ласт проверка D
    { key: 'conclusion_date', position: 5 }, // дата заключения E
    { key: 'fio', position: 6 }, // фио F
    { key: 'birth_date', position: 7 }, // рождения должника G
    { key: 'KD', position: 8 }, // кд H
    { key: 'portfolio', position: 9 }, // портфель I
    { key: 'purpose', position: 10 }, // назначение J
    { key: 'bank_sum', position: 11 }, // сумма переданная банком K
    { key: 'court_sum', position: 12 }, // судебная сумма L
    { key: 'debt_sum', position: 13 }, // сумма долга M
    { key: 'recalculation_sum', position: 14 }, // сумма пересчета/индексации N
    { key: 'discount_total', position: 15 }, // тотал ( который высчитывается) O
    { key: 'discount_sum', position: 16 }, // сумма дисконта P
    { key: 'sumBeforeAgreement', position: 17 }, // сумма (платежей) после соглешeния Q
    { key: 'firstPaymentAgreement', position: 18 }, //Дата поступления первого платежа по соглашения R
    { key: 'firstSumPaymentAgreement', position: 19 }, //Сумма первого платежа по соглашению S
    { key: 'month_pay_day', position: 20 }, // Число платежа каждого месяца (день в который должен придти платеж) T
    { key: 'lastPaymentDate', position: 21 }, // дата последнего платежа U
    { key: 'lastPaymentSum', position: 22 }, // сумма последнего платежа V
    { key: 'totalSumAgreement', position: 23 }, // Общая сумма платежей поступивших по соглашению W
    { key: 'restOfDueAfterLastPayment', position: 24 }, // Остаток задолженности после поступления последнего платежа X
    { key: 'new_reg_doc', position: 25 }, // наличие ИД (новый рег док, потому что boolean (см. историю гита)) Y
    { key: 'registrator', position: 26 }, // регистратор Z
    { key: 'archive', position: 27 }, // наличие в архиве AA
    { key: 'receipt_dt', position: 28 }, // дата получения листа AB
    { key: 'actions_for_get', position: 29 }, // действия для получения листа AC
    { key: 'limitationPeriod', position: 30 }, // Срок исковой давности AD
    { key: 'id_submission_deadline', position: 31 }, // Срок предъявления ИД
    { key: 'registerCreditCount', position: 33 }, //Количество кредитов в реестра AG
    { key: 'guarantorCount', position: 34 }, //Наличие поручителей /правопреемников (наследников) AH
    { key: 'deposit_typ', position: 35 }, // Наличие залогового имущества AI
    { key: 'comment', position: 36 }, // коммент AJ
    { key: 'status_debt', position: 37 }, // Статус долга AK
    { key: 'collector', position: 38 }, // Взыскатель AL
    { key: 'task_link', position: 39 }, // ссылка на задачу AM
  ];
/**
 * СОГЛАШЕНИЯ ОБ ОТСТУПНОМ
 */
export const agreementCompensationColumns: (Partial<Column> & {
  position: number;
})[] = [
  { key: 'id_dela', position: 1 }, // ID дела
  { key: 'id_debt', position: 2 }, // id долга C
  { key: 'last_check_date', position: 3 }, //ласт проверка D
  { key: 'conclusion_date', position: 4 }, // дата заключения E
  { key: 'fio', position: 5 }, // фио F
  { key: 'birth_date', position: 6 }, // рождения должника G
  { key: 'KD', position: 7 }, // кд H
  { key: 'portfolio', position: 8 }, // портфель I
  { key: 'purpose', position: 9 }, // назначение J
  { key: 'bank_sum', position: 10 }, // сумма переданная банком K
  { key: 'court_sum', position: 11 }, // судебная сумма L
  { key: 'debt_sum', position: 12 }, // сумма долга M
  { key: 'recalculation_sum', position: 13 }, // сумма к погашению с по соглашению с дисконтом
  { key: 'discount_total', position: 14 }, // тотал ( который высчитывается) O
  { key: 'discount_sum', position: 15 }, // сумма дисконта P
  { key: 'sumBeforeAgreement', position: 16 }, // Поступление платежей до заключения соглашения Q
  { key: 'firstPaymentDate', position: 17 }, // Дата поступления первого платежа по соглашения R
  { key: 'lastPaymentDate', position: 18 }, // дата последнего платежа U
  { key: 'month_pay_day', position: 19 }, // Число платежа каждого месяца (день в который должен придти платеж) T
  { key: 'lastPaymentSumAfterAgr', position: 20 }, // Сумма первого платежа по соглашению S
  { key: 'lastPaymentSum', position: 21 }, // сумма последнего платежа V
  { key: 'totalSumAgreement', position: 22 }, // Общая сумма платежей поступивших по соглашению W
  { key: 'restOfDueAfterLastPayment', position: 23 }, // Остаток задолженности после поступления последнего платежа X
  { key: 'new_reg_doc', position: 24 }, // наличие ИД (новый рег док, потому что boolean (см. историю гита)) Y
  { key: 'registrator', position: 25 }, // наличие регистраторе Z
  { key: 'archive', position: 26 }, // наличие ИД в архиве AA
  { key: 'receipt_dt', position: 27 }, // дата получения листа AB
  { key: 'actions_for_get', position: 28 }, // действия для получения листа AC
  { key: 'limitationPeriod', position: 29 }, // Срок исковой давности AD
  { key: 'id_submission_deadline', position: 30 }, // Дата пропуска предъявления ИД
  { key: 'registerCreditCount', position: 32 }, //Количество кредитов в реестра AG
  { key: 'guarantorCount', position: 33 }, //Наличие поручителей /правопреемников (наследников) AH
  { key: 'deposit_typ', position: 34 }, // Наличие залогового имущества AI
  { key: 'comment', position: 35 }, // коммент AJ
  { key: 'status_debt', position: 36 }, // Статус долга AK
  { key: 'collector', position: 37 }, // Взыскатель AL
  { key: 'task_link', position: 38 }, // ссылка на задачу AM
  { key: 'date_law_on', position: 39 }, // Дата вступления в закон силу
];
