import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { CreateCommentInput } from './Comment.input';
import { CommentModel } from 'src/Modules/Database/Local.Database/models/Comment';

export class CommentService {
  constructor(
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(CommentModel, 'local')
    private readonly modelComment: typeof CommentModel,
  ) {}
  async addComment(data: CreateCommentInput) {
    const comment = this.modelComment.create(data);
    return comment;
  }
}
