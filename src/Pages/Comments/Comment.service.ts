import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { ForeignKeyConstraintError } from '@sql-tools/sequelize';
import { CommentInput } from './Comment.input';
import { Comment } from 'src/Modules/Database/Local.Database/models/Comment';
import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { User } from '../../Modules/Database/Local.Database/models/User.model';
const NotFounds: Record<string, string> = {
  comments_id_Agreements_fk: 'Такое соглашение не найдено',
  comments_id_Users_fk: 'Такого пользователя не существует',
};
@Injectable()
export class CommentService {
  constructor(
    /**
     * this.modelAgreement.associations; прикол ассоциаций - на заметку
     */
    @InjectModel(Comment, 'local')
    private readonly modelComment: typeof Comment,
    @InjectModel(User, 'local')
    private readonly modelUser: typeof User,
  ) {}
  async addComment(@Body() body: CommentInput, auth: AuthResult) {
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
  async getAll(id_agreement: number) {
    const comment = await this.modelComment.findAll({
      where: {
        id_agreement: id_agreement,
      },
      include: {
        model: this.modelUser,
        attributes: ['id', 'login'],
      },
    });
    return comment;
  }

  async deleteComment(id_comment: number) {
    return await this.modelComment.destroy({
      where: {
        id: id_comment,
      },
    });
  }

  async patchComment(id_comment: number, editData: CommentInput) {
    const comment = await this.modelComment.findOne({
      where: {
        id: id_comment,
      },
    });
    await comment?.update({ comment: editData.comment });
  }

  async getComment(id_comment: number) {
    return await this.modelComment.findOne({
      where: {
        id: id_comment,
      },
    });
  }
}
