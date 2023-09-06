import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentInput {
  @ApiProperty({
    description: 'комментарий',
  })
  @IsOptional()
  @IsString()
  @Expose()
  comment: string;

  @ApiProperty({
    description: 'id Соглашений',
  })
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id_agreement: number;
}
