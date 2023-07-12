import { Body, Controller, Post } from '@nestjs/common';
import { CommentService } from './Comment.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCommentInput } from './Comment.input';
@ApiTags('Comments')
@Controller('Comments')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post()
  addCommentToAgreement(@Body() body: CreateCommentInput) {
    return this.service.addComment(body);
  }
}
