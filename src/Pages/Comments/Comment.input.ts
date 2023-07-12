import { CreationAttributes } from '@sql-tools/sequelize';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { AllowNull, ForeignKey } from '@sql-tools/sequelize-typescript';
import { CommentModel } from 'src/Modules/Database/Local.Database/models/Comment';
import { User } from '@contact/models';

export class CreateCommentInput implements CreationAttributes<CommentModel> {
  @Expose()
  @IsOptional()
  @IsString()
  comment: string | null;
  @AllowNull(false)
  @Expose()
  id_agreement: number;
  @AllowNull(false)
  @Expose()
  @ForeignKey(() => User)
  user: number;
}
