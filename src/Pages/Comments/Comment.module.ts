import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { CommentController } from './Comment.controller';
import { CommentService } from './Comment.service';
import { Comment } from 'src/Modules/Database/Local.Database/models/Comment';
@Module({
  imports: [SequelizeModule.forFeature([Comment], 'local')],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
