import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { CommentController } from './Comment.controller';
import { CommentService } from './Comment.service';
import { CommentModel } from 'src/Modules/Database/Local.Database/models/Comment';
import { User } from 'src/Modules/Database/Local.Database/models/User.model';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
@Module({
  imports: [
    SequelizeModule.forFeature([CommentModel, User, Agreement], 'local'),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
