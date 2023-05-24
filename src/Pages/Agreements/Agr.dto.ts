import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
export class AgrGetAllDto extends Agreement {
  sumBeforeAgr: number | null = null;
  firstPayment: number | null = null;
  firstPaymentDate: Date;
  lastPayment: number | null = null;
  lastPaymentDate: Date;
  sumAfterAgr: number | null = null;
}
