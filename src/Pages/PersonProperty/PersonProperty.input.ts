import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateLinkPersonPropertyInput {
  @Expose()
  @IsNumber()
  @ApiProperty()
  id_person_property: number;
  @Expose()
  @IsNumber()
  @ApiProperty()
  id_agreement: number;
}
export class DeleteLinkPersonPropertyInput {
  @Expose()
  @IsNumber()
  @ApiProperty()
  id_person_property: number;
  @Expose()
  @IsNumber()
  @ApiProperty()
  id_agreement: number;
}
