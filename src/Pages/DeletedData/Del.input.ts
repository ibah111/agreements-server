import { GridFilterModel } from '@mui/x-data-grid-premium';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsNumberOrStringOrBoolean } from 'src/utils/validators/IsNumberOrStringOrBoolean';
import { PaginationValidator } from '../Agreements/Agr.input';

export class AgrDelInput {
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
