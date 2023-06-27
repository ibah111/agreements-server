import { Column } from 'exceljs';
/**
 * @typeColumns ДЕЙСТВУЮЩИЕ
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
export const runnedColumns: (Partial<Column> & {})[] = [
  {},
  {},
  { key: 'id_debt' },
  {},
  { key: 'conclusion_date' },
  { key: 'fio' },
  { key: 'birth_date' },
  {},
  {},
  { key: 'purpose' },
  { key: 'bank_sum' },
  { key: 'court_sum' },
  { key: 'debt_sum' },
  { key: 'recalculation_sum' },
  { key: 'discount_total' }, // тотал ( который высчитывается)
  { key: 'discount_sum' },
  {},
  {},
  {},
  { key: 'month_pay_day' },
  {},
  {},
  {},
  {},
  { key: 'new_reg_doc' },
  { key: 'registrator' },
  { key: 'archive' },
  { key: 'receipt_dt' },
  { key: 'actions_for_get' },
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  { key: 'comment' },
  {},
  { key: 'task_link' },
  { key: '' }, // Дата вступления в закон силу
];

/**
 * @typeColumns ИСПОЛНЕННЫЕ
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
export const donedColumns: (Partial<Column> & {})[] = [
  { key: '№' },
  { key: 'id_dela' }, // хз как по другому назвать
  { key: 'id_debt' }, // id долга
  { key: 'last_check_date' }, //ласт проверка
  { key: 'conclusion_date' }, // дата заключения
  { key: 'fio' }, // фио
  { key: 'birth_date' }, // рождения должника
  { key: 'KD' }, // кд
  { key: 'portfolio' }, // портфель
  { key: 'purpose' }, // назначение
  { key: 'bank_sum' }, // сумма переданная банком
  { key: 'court_sum' }, // судебная сумма
  { key: 'debt_sum' }, // сумма долга
  { key: 'recalculation_sum' }, // сумма пересчета
  { key: 'discount_total' }, // тотал ( который высчитывается)
  { key: 'discount_sum' }, // сумма дисконта
  { key: 'sumBeforeAgreement' }, // сумма (платежей) после соглешния
  { key: 'firstPaymentAgreement' }, //Дата поступления первого платежа по соглашения
  { key: 'firstSumPaymentAgreement' }, //Сумма первого платежа по соглашению
  { key: 'month_pay_day' }, // ежемесячная дата платежа (день в который должен придти платеж)
  { key: 'lastPaymentDate' }, // дата последнего платежа
  { key: 'lastPaymentSum' }, // сумма последнего платежа
  { key: 'totalSumAgreement' }, // Общая сумма платежей поступивших по соглашению
  { key: 'restOfDueAfterLastPayment' }, // Остаток задолженности после поступления последнего платежа
  { key: 'new_reg_doc' }, // наличие ИД (новый рег док, потому что boolean (см. историю гита))
  { key: 'registrator' }, // регистратор
  { key: 'archive' }, // наличие в архиве
  { key: 'receipt_dt' }, // дата получения листа
  { key: 'actions_for_get' }, // действия для получения листа
  { key: 'limitationPeriod' }, // Срок исковой давности
  { key: 'dateForceLawEntry' }, // дата поступления в законную силу
  { key: 'id_submission_deadline' }, // Срок предъявления ИД
  { key: 'registerCreditCount' }, // Количество кредитов в реестра
  { key: 'guarantorCount' }, // Наличие поручителей /правопреемников (наследников)
  { key: 'deposit_typ' }, // Наличие залогового имущества
  { key: 'comment' }, // коммент
  { key: 'status_debt' }, // Статус долга
  { key: 'recoverer' }, // Взыскатель
  { key: 'task_link' }, // ссылка на задачу
];
/**
 * @typeColumns УТРАТИВШИЕ СИЛУ
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
export const outOfStrengthColumns: (Partial<Column> & {})[] = [
  { key: '№' }, // A
  { key: 'id_dela' }, // хз как по другому назвать B
  { key: 'id_debt' }, // id долга C
  { key: 'last_check_date' }, //ласт проверка D
  { key: 'conclusion_date' }, // дата заключения E
  { key: 'fio' }, // фио F
  { key: 'birth_date' }, // рождения должника G
  { key: 'KD' }, // кд H
  { key: 'portfolio' }, // портфель I
  { key: 'purpose' }, // назначение J
  { key: 'bank_sum' }, // сумма переданная банком K
  { key: 'court_sum' }, // судебная сумма L
  { key: 'debt_sum' }, // сумма долга M
  { key: 'recalculation_sum' }, // сумма пересчета/индексации N
  { key: 'discount_total' }, // тотал ( который высчитывается) O
  { key: 'discount_sum' }, // сумма дисконта P
  { key: 'sumBeforeAgreement' }, // сумма (платежей) после соглешeния Q
  { key: 'firstPaymentAgreement' }, //Дата поступления первого платежа по соглашения R
  { key: 'firstSumPaymentAgreement' }, //Сумма первого платежа по соглашению S
  { key: 'month_pay_day' }, // Число платежа каждого месяца (день в который должен придти платеж) T
  { key: 'lastPaymentDate' }, // дата последнего платежа U
  { key: 'lastPaymentSum' }, // сумма последнего платежа V
  { key: 'totalSumAgreement' }, // Общая сумма платежей поступивших по соглашению W
  { key: 'restOfDueAfterLastPayment' }, // Остаток задолженности после поступления последнего платежа X
  { key: 'new_reg_doc' }, // наличие ИД (новый рег док, потому что boolean (см. историю гита)) Y
  { key: 'registrator' }, // регистратор Z
  { key: 'archive' }, // наличие в архиве AA
  { key: 'receipt_dt' }, // дата получения листа AB
  { key: 'actions_for_get' }, // действия для получения листа AC
  { key: 'limitationPeriod' }, // Срок исковой давности AD
  { key: 'id_submission_deadline' }, // Срок предъявления ИД
  {}, // ???
  { key: 'registerCreditCount' }, //Количество кредитов в реестра AG
  { key: 'guarantorCount' }, //Наличие поручителей /правопреемников (наследников) AH
  { key: 'deposit_typ' }, // Наличие залогового имущества AI
  { key: 'comment' }, // коммент AJ
  { key: 'status_debt' }, // Статус долга AK
  { key: 'recoverer' }, // Взыскатель AL
  { key: 'task_link' }, // ссылка на задачу AM
  {}, // AN
  {}, // AO
];
/**
 * @typeColumns СОГЛАШЕНИЯ ОБ ОТСТУПНОМ
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
export const agreementCompensationColumns: (Partial<Column> & {})[] = [
  { key: 'id_dela' }, // ID дела
  { key: 'id_debt' }, // id долга C
  { key: 'last_check_date' }, //ласт проверка D
  { key: 'conclusion_date' }, // дата заключения E
  { key: 'fio' }, // фио F
  { key: 'birth_date' }, // рождения должника G
  { key: 'KD' }, // кд H
  { key: 'portfolio' }, // портфель I
  { key: 'purpose' }, // назначение J
  { key: 'bank_sum' }, // сумма переданная банком K
  { key: 'court_sum' }, // судебная сумма L
  { key: 'debt_sum' }, // сумма долга M
  { key: 'recalculation_sum' }, // сумма к погашению с по соглашению с дисконтом
  { key: 'discount_total' }, // тотал ( который высчитывается) O
  { key: 'discount_sum' }, // сумма дисконта P
  { key: 'sumBeforeAgreement' }, // Поступление платежей до заключения соглашения Q
  { key: 'firstPaymentDate' }, // Дата поступления первого платежа по соглашения R
  { key: 'lastPaymentDate' }, // дата последнего платежа U
  { key: 'lastPaymentSum' }, // Сумма первого платежа по соглашению S
  { key: 'month_pay_day' }, // Число платежа каждого месяца (день в который должен придти платеж) T
  { key: 'lastPaymentSum' }, // сумма последнего платежа V
  { key: 'totalSumAgreement' }, // Общая сумма платежей поступивших по соглашению W
  { key: 'restOfDueAfterLastPayment' }, // Остаток задолженности после поступления последнего платежа X
  { key: 'new_reg_doc' }, // наличие ИД (новый рег док, потому что boolean (см. историю гита)) Y
  { key: 'registrator' }, // наличие регистраторе Z
  { key: 'archive' }, // наличие ИД в архиве AA
  { key: 'receipt_dt' }, // дата получения листа AB
  { key: 'actions_for_get' }, // действия для получения листа AC
  { key: 'limitationPeriod' }, // Срок исковой давности AD
  { key: 'id_submission_deadline' }, // Дата пропуска предъявления ИД
  { key: '' }, // ???
  { key: 'registerCreditCount' }, //Количество кредитов в реестра AG
  { key: 'guarantorCount' }, //Наличие поручителей /правопреемников (наследников) AH
  { key: 'deposit_typ' }, // Наличие залогового имущества AI
  { key: 'comment' }, // коммент AJ
  { key: 'status_debt' }, // Статус долга AK
  { key: 'recoverer' }, // Взыскатель AL
  { key: 'task_link' }, // ссылка на задачу AM
  { key: 'date_law_on' }, // Дата вступления в закон силу
];
