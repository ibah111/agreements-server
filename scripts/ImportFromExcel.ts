import { program } from 'commander';
import { Column, Row, Workbook, Worksheet } from 'exceljs';
interface Opts {
  path: string;
}
async function importRunned(data: Worksheet) {
  const predata: Record<string, Row[]> = {};
  const columns: Partial<Column>[] = [
    { key: 'id' },
    { key: 'law_act_id' },
    { key: 'debt_id' },
    {},
    { key: 'conclusion_date' },
    { key: 'fio' },
    { key: 'birth_date' },
    {},
    {},
  ];
  data.columns = columns;
  const rows = data.getRows(2, data.actualColumnCount) || [];
  for (const row of rows) {
    const unique =
      (row.getCell('conclusion_date').value || '').toString() +
      (row.getCell('fio').value || '').toString() +
      (row.getCell('birth_date').value || '').toString();
    if (!predata[unique]) predata[unique] = [];
    predata[unique].push(row);
  }
}
async function main() {
  const opts = program.option('-p, --path <string>').parse().opts() as Opts;
  const workbook = new Workbook();
  await workbook.xlsx.readFile(opts.path);
  /**
   * обращаться к таблице с помощь массива[] проще, [0] - действующие
   */
  const worksheet_runned = workbook.worksheets[0]; // действующие
  if (!worksheet_runned) return;
  const worksheet_finished = workbook.worksheets[1]; // Исполненные
  if (!worksheet_finished) return;
  const worksheet_break = workbook.worksheets[2]; // Утратившие силу
  if (!worksheet_break) return;
  const worksheet_shit = workbook.worksheets[3]; // Соглашения об отсутпном
  if (!worksheet_shit) return;
  importRunned(worksheet_runned);
}
main();
