import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
export class AgrGetAllDto extends Agreement {
  firstPayment: number | null = null;
  lastPayment: number | null = null;
  lastPaymentDate: Date;
  sumAfterAgr: number | null = null;
}
