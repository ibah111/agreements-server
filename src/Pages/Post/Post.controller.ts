import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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
  @Post('EditPost/:id')
  async editPost(@Body() index: EditPostInput) {
    return this.service.editPost(index);
  }
  @Delete('DeletePost/:id')
  async deletePost(@Param('id') index: number) {
    return await this.service.deletePost(index);
  }
  @Get('GetPost/:id')
  async getPost(@Param('id') index: number) {
    return await this.service.GetPost(index);
  }
}
