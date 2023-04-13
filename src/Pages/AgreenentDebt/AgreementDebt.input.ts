import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetAgreementDebtInput {
  @Expose()
  @IsNumber()
  @ApiPropertyOptional()
  id: number;
}
