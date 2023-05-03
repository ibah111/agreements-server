import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AgreementToDebtInput {
  @Expose()
  @IsNumber()
  id_agreement: number;

  @Expose()
  @IsNumber()
  id_debt: number;
}
