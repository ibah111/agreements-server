import { ApiProperty } from '@nestjs/swagger';
import { CreationAttributes } from '@sql-tools/sequelize';
import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Collectors } from 'src/Modules/Database/Local.Database/models/Collectors';

export class SearchUserInput {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsOptional()
  fio: string;
}
export class CreateCollectorInput implements CreationAttributes<Collectors> {
  @Expose()
  @ApiProperty()
  @IsNumber()
  id_contact: number;

  @Expose()
  @ApiProperty()
  @IsString()
  fio: string;

  @Expose()
  @ApiProperty()
  @IsString()
  department_name: string;
}
