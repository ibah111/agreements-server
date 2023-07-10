import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreationAttributes } from '@sql-tools/sequelize';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import { CallbackValidate } from 'src/utils/validators/IsAfterValidate';
import moment from 'moment';
import { GridFilterModel, GridPaginationModel } from '@mui/x-data-grid-premium';
import { IsNumberOrStringOrBoolean } from 'src/utils/validators/IsNumberOrStringOrBoolean';

export class CreateAgreementInput implements CreationAttributes<Agreement> {
  @ApiProperty()
  @Expose()
  @IsNumber()
  person_id: number;

  @CallbackValidate<CreateAgreementInput, Date>(
    (obj) => obj.finish_date,
    (value1, value2) => (value1 ? moment(value1).isSameOrAfter(value2) : true),
    { message: 'Дата введена неверно $property' },
  )
  @Expose()
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  @Type(() => Date)
  conclusion_date: Date;

  @CallbackValidate<CreateAgreementInput, Date>(
    (obj) => obj.conclusion_date,
    (value1, value2) => moment(value1).isSameOrBefore(value2),
    { message: 'Дата введена неверно $property' },
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
  agreement_type: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  purpose: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  statusAgreement: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  bank_sum: number | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  court_sum: number | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  debt_sum: number | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  recalculation_sum: number | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  discount_sum: number | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  discount: number | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  month_pay_day?: number | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  new_reg_doc: number;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  comment: string | null;

  @Expose()
  @IsString()
  @ApiProperty()
  @IsOptional()
  task_link: string | null;

  @Expose()
  @IsString()
  @ApiProperty()
  @IsOptional()
  actions_for_get: string | null;

  @Expose()
  @IsDate()
  @IsOptional()
  @ApiProperty()
  @Type(() => Date)
  receipt_dt: Date;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  registrator: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  archive: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  collector: string | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  collector_id: number | null;
}

export class DeleteSelectedAgreements {
  @Expose()
  @IsArray()
  @IsNumber({ maxDecimalPlaces: 0 }, { each: true })
  @IsNotEmpty()
  @ApiProperty({ type: [Number] })
  list: number[];
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
  value: number | string | boolean | null;
}
export class GetAgreementWith {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  r_law_act_id: number;
}
export class PaginationValidator implements GridPaginationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  pageSize: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  page: number;
}
export class AgreementsAll {
  @ValidateNested()
  @Type(() => PaginationValidator)
  @Expose()
  @IsNotEmpty()
  paginationModel: PaginationValidator;
  @ApiProperty()
  @IsObject()
  @Expose()
  filterModel: GridFilterModel;
}
