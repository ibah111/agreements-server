import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class SearchInput {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsOptional()
  // * name
  fio: string;
  @Expose()
  @ApiProperty()
  @IsString()
  @IsOptional()
  // * KD
  contract: string;
}
