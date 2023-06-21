import { GridFilterModel } from '@mui/x-data-grid-premium';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { PaginationValidator } from '../Agreements/Agr.input';

export class CheckAgreementOD {
  @Expose()
  @IsNumber()
  @ApiPropertyOptional()
  agreementId: number;
}
export class CheckAllAgreementOD {
  @Expose()
  @IsNumber()
  @ApiPropertyOptional()
  agreementIdList: number[];
}
export class OverduePagination {
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
