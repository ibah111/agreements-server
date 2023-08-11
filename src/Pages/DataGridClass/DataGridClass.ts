import {
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose } from 'class-transformer';
import {
  ValidateNested,
  IsNotEmpty,
  IsObject,
  IsNumber,
} from 'class-validator';
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
export class DataGridClass {
  @ValidateNested()
  @Type(() => PaginationValidator)
  @Expose()
  @IsNotEmpty()
  paginationModel: PaginationValidator;
  @ApiProperty()
  @IsObject()
  @Expose()
  filterModel: GridFilterModel;
  @ApiProperty()
  @Expose()
  sortModel?: GridSortModel;
}
