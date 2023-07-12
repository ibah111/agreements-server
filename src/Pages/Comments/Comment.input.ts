import { CreationAttributes } from '@sql-tools/sequelize';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { AllowNull, Column, ForeignKey } from '@sql-tools/sequelize-typescript';
import { CommentModel } from 'src/Modules/Database/Local.Database/models/Comment';
import { User } from '@contact/models';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentInput implements CreationAttributes<CommentModel> {
  @ApiProperty({
    description: 'комментарий',
  })
  @IsOptional()
  @IsString()
  @Expose()
  comment: string;

  @ApiProperty({
    description: 'id соглашений, не ДБ пустым',
  })
  @AllowNull(false)
  @IsNumber()
  @Expose()
  @Column
  id_agreement: number;

  @ApiProperty({ description: 'Пользователь кто оставляет сообщение' })
  @AllowNull(false)
  @Expose()
  @ForeignKey(() => User)
  @Column
  user: number;
}
/**
 * я не понял почему он мне дропает ошибку связанную с column
 * https://github.com/sequelize/sequelize-typescript/issues/692?ysclid=ljzuwqota2808637619
 * решил ее с помощью @Column, но я думаю что так не должно решаться, хотя хз
 */
