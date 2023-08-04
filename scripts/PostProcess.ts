import { ResultRow } from './ImportFromExcel';

type ProcessFunc = (obj: ResultRow) => void;

const newRegDoc: ProcessFunc = (obj) => {
  if (obj.registrator) {
    obj['reg_doc'] = 2;
  }
  if (obj.archive) {
    obj['reg_doc'] = 3;
  }
};

export const procesFuncArray: ProcessFunc[] = [newRegDoc];
