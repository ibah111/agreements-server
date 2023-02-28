import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Paper } from 'src/Modules/LocalDatabase/Models/Paper';

import { PostController } from './Post.controller';
import { PostService } from './Post.service';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [SequelizeModule.forFeature([Paper])],
})
export class PostPage {}
