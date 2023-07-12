import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { CreateCommentInput } from './Comment.input';
import { CommentModel } from 'src/Modules/Database/Local.Database/models/Comment';
import { Body, Injectable } from '@nestjs/common';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(CommentModel, 'local')
    private readonly modelComment: typeof CommentModel,
  ) {}
  async addComment(@Body() body: CreateCommentInput) {
    const [comment, created] = await this.modelComment.findOrCreate({
      where: { id_agreement: body.id_agreement },
    });
    if (created) return comment;
  }
}
