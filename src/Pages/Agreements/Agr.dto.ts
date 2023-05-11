import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
export class AgrGetAllDto extends Agreement {
  firstPayment: number | null = null;
  lastPayment: number | null = null;
  sumAfterAgr: number | null = null;
}
