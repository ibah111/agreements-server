import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAgreementInput {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  r_law_act_id: number;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  last_check_date: Date;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
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
  month_pay: number;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  reg_doc?: boolean;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  finish_doc?: boolean;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  actions_for_get?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  comment?: string | null;

  @Expose()
  @IsString()
  @IsNotEmpty()
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
 * Редактирование соглашения (id, name, etc)
 */
export class EditAgreementInput {
  @Expose()
  @IsNumber()
  @ApiPropertyOptional()
  id: number;
}
