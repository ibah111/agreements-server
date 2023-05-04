import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AgreementToDebtInput {
  @Expose()
  @IsNumber()
  @ApiProperty()
  id_agreement: number;

  @Expose()
  @IsNumber()
  @ApiProperty()
  id_debt: number;
}
export class DeleteAgrementToDebtInput {
  @Expose()
  @IsNumber()
  @ApiProperty()
  id_agreement: number;

  @Expose()
  @IsNumber()
  @ApiProperty()
  id_debt: number;
}
export class GetAgrementDebts {
  @Expose()
  @IsNumber()
  @ApiProperty()
  id_agreement: number;
}
export class GetAllowedDebtsInput {
  @Expose()
  @IsNumber()
  @ApiProperty()
  id_agreement: number;
}
