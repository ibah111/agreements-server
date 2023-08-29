import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class PaymentsInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id_agreement: number;

  @Expose()
  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  pay_day: Date;

  @ApiProperty()
  @Expose()
  @IsNumber()
  sum_owe: number;

  @ApiProperty()
  @IsBoolean()
  @Expose()
  status: boolean;

  @ApiProperty()
  @Expose()
  @IsNumber()
  x: number;
}

export class updateStatusInput {
  @ApiProperty()
  @Expose()
  @IsNumber()
  id_payment: number;
  @ApiProperty()
  @Expose()
  @IsNumber()
  id_agreement: number;
}
