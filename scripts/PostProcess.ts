import { ResultRow } from './ImportFromExcel';

type ProcessFunc = (obj: ResultRow) => void;

const newRegDoc: ProcessFunc = (obj) => {
  if (obj.registrator) {
    obj['new_regDoc'] = 2;
  }
  if (obj.archive) {
    obj['new_regDoc'] = 3;
  }
};

// const comment: ProcessFunc = (obj) => {
//   if (obj.purpose) obj['comment'] = obj.purpose.toString();
// };

export const procesFuncArray: ProcessFunc[] = [newRegDoc];
