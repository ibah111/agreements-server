import { Module } from '@nestjs/common';
import { PostPage } from './Post/Post.page';

@Module({
  imports: [PostPage],
})
export class PagesModule {}
