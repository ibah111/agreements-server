import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreationAttributes } from '@sql-tools/sequelize';
import { ScheduleLinks } from '../../Modules/Database/Local.Database/models/SchedulesLinks';

export class PaymentsInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id_schedule: number;

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
  sum_left: number;

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

export class DeletePaymentList {
  @Expose()
  @IsArray()
  @IsNumber({ maxDecimalPlaces: 0 }, { each: true })
  @IsNotEmpty()
  @ApiProperty({ type: [Number] })
  list: number[];
}
export class CreateScheduleLink implements CreationAttributes<ScheduleLinks> {
  @Expose()
  @IsNumber()
  @ApiProperty()
  id_agreement: number;
  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  schedule_type: number;
  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  id_debt: number;
  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  contract: string;
}
