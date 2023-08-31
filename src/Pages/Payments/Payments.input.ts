import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

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
  @Expose()
  @IsOptional()
  @IsNumber()
  sum_payed: number;

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

export class InputPaymentsUpdate {
  id: number;

  @Expose()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ type: Date, required: true, nullable: false })
  pay_day: Date;

  @Expose()
  @IsNumber()
  @ApiProperty({ type: Number, required: true, nullable: false })
  sum_owe: number;
}
