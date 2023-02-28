import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddPostInput, EditPostInput } from '../Post/Post.input';
import { PostService } from '../Post/Post.service';

@ApiTags('Post')
@Controller('Post')
export class PostController {
  constructor(private readonly service: PostService) {}
  @Post('AddPost')
  async createUser(@Body() body: AddPostInput) {
    return await this.service.addPost({ data: body });
  }
  @Delete('DeletePost/:id')
  async deletePost(@Body() index: number) {
    return await this.service.deletePost(index);
  }
  @Put('EditPost/:id')
  async editPost(@Body() index: EditPostInput) {
    return this.service.editPost(index);
  }
}
