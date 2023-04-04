import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsNumberOrStringOrBoolean } from 'src/utils/validators/IsNumberOrStringOrBoolean';
export class CreateAgreementInput {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  r_debt_id: number;

  // @Expose()
  // @IsDate()
  // @IsNotEmpty()
  // @ApiProperty()
  // @Type(() => Date)
  // last_check_date: Date;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  @Type(() => Date)
  conclusion_date: Date;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  purpose: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  court_sum: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  debt_sum: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  recalculation_sum?: number | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  discount_sum?: number | null;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  month_pay_day: number;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  reg_doc?: boolean;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  comment?: string | null;

  @Expose()
  @IsString()
  @ApiProperty()
  task_link: string;
}
export class DeleteAgreementInput {
  @Expose()
  @IsNumber()
  @ApiPropertyOptional()
  id: number;
}
/*
 * Получение соглашение
 */
export class GetAgreementInput {
  @Expose()
  @IsNumber()
  @ApiPropertyOptional()
  id: number;
}
/*
 * Редактирование соглашения (field, value)
 */
export class EditAgreementInput {
  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  field: string;
  @Expose()
  @ApiProperty()
  @IsNumberOrStringOrBoolean()
  value: number | string | boolean;
}
export class GetAgreementWith {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  r_law_act_id: number;
}
