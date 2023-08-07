import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetDebtPersonInput {
  @Expose()
  @IsNumber()
  @ApiPropertyOptional()
  id: number;
}
export class GetAllDebtsPersonInput {
  @Expose()
  @IsNumber()
  @ApiPropertyOptional()
  parent_id: number; // as example answer must give me 2 {json}
}

export class GetAllPayments {
  @Expose()
  @IsNumber()
  @ApiPropertyOptional()
  parent_id: number;
}
