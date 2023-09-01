interface Payment {
  id: number;
  pay_day: string;
  sum_owe: number;
  sum_left: number;
  status: boolean;
}
interface Calc {
  id: number;
  sum: number;
}
const payments: Payment[] = [
  {
    id: 1,
    pay_day: '23.05.2023',
    sum_owe: 2000,
    sum_left: 2000,
    status: false,
  },
  {
    id: 2,
    pay_day: '05.06.2023',
    sum_owe: 2000,
    sum_left: 2000,
    status: false,
  },
  {
    id: 3,
    pay_day: '23.06.2023',
    sum_owe: 2000,
    sum_left: 2000,
    status: false,
  },
  {
    id: 4,
    pay_day: '23.07.2023',
    sum_owe: 2000,
    sum_left: 2000,
    status: false,
  },
];
const calcs: Calc[] = [
  { id: 1, sum: 500 },
  { id: 1, sum: 500 },
  { id: 1, sum: 500 },
  { id: 1, sum: 2000 },
];
let current_calc = 0;
let current_pay = 0;
const last_calc = calcs.length - 1;
const last_pay = payments.length - 1;
let wallet = 0;
while (true) {
  const calc = calcs[current_calc];
  wallet += calc.sum;
  while (true) {
    if (wallet === 0) break;
    const pay = payments[current_pay];
    if (!pay) break;
    const sum_left = pay.sum_left - wallet;
    if (sum_left < 0) {
      wallet -= pay.sum_left;
      pay.sum_left = 0;
    } else {
      pay.sum_left = sum_left;
      wallet = 0;
    }
    /**
     * Надо написать связь многое ко многим
     * <----  Здесь
     * pay.calcs.push(calcs[current_calc].id);
     * <----  Здесь
     */
    if (pay.sum_left === 0) {
      pay.status = true;
      current_pay++;
    }
    if (wallet === 0 || (pay.sum_left > 0 && last_pay === current_pay)) break;
  }
  if (last_calc === current_calc || (wallet > 0 && last_pay === current_pay))
    break;
  current_calc++;
}
console.log(payments);
