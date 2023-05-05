import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreationAttributes } from '@sql-tools/sequelize';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import { IsNumberOrStringOrBoolean } from 'src/utils/validators/IsNumberOrStringOrBoolean';
import { CallbackValidate } from 'src/utils/validators/IsAfterValidate';
import moment from 'moment';

export class CreateAgreementInput implements CreationAttributes<Agreement> {
  @ApiProperty()
  @Expose()
  @IsNumber()
  personId: number;

  @CallbackValidate<CreateAgreementInput, Date>(
    (obj) => obj.finish_date,
    (value1, value2) => (value1 ? moment(value1).isAfter(value2) : true),
  )
  @Expose()
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  @Type(() => Date)
  conclusion_date: Date;

  @CallbackValidate<CreateAgreementInput, Date>(
    (obj) => obj.conclusion_date,
    (value1, value2) => moment(value1).isBefore(value2),
  )
  @Expose()
  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  @IsOptional()
  finish_date: Date;

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

  @Expose()
  @IsString()
  @ApiProperty()
  actions_for_get: string;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  @Type(() => Date)
  receipt_dt: Date;
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
