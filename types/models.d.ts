import '@contact/models';
import { DebtCalc } from '@contact/models';
import { HasManyAttribute } from '@sql-tools/association-literal';
import { NonAttribute } from '@sql-tools/sequelize';
declare module '@contact/models' {
  export class Debt {
    LastCalcs?: HasManyAttribute<NonAttribute<DebtCalc[]>>;
  }
}
