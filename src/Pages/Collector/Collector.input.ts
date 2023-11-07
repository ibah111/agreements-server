import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

export class SearchUserInput {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsOptional()
  fio: string;
}
