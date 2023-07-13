import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { ForeignKeyConstraintError } from '@sql-tools/sequelize';
import { CreateCommentInput } from './Comment.input';
import { Comment } from 'src/Modules/Database/Local.Database/models/Comment';
import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
const NotFounds: Record<string, string> = {
  comments_id_Agreements_fk: 'Такое соглашение не найдено',
  comments_id_Users_fk: 'Такого пользователя не существует',
};
@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment, 'local')
    private readonly modelComment: typeof Comment,
  ) {}
  async addComment(@Body() body: CreateCommentInput, auth: AuthResult) {
    try {
      return await this.modelComment.create({
        ...body,
        user: auth.userLocal.id,
      });
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError)
        throw new NotFoundException(NotFounds[error.index as string]);
      throw error;
    }
  }
}
