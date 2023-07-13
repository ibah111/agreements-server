import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './Comment.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCommentInput } from './Comment.input';
import { Auth, AuthGuard, AuthResult } from 'src/Modules/Guards/auth.guard';
import { CanGuard } from 'src/Modules/Casl/Can.guard';
@UseGuards(CanGuard)
@UseGuards(AuthGuard)
@ApiTags('Comments')
@Controller('Comments')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post()
  addCommentToAgreement(
    @Body() body: CreateCommentInput,
    @Auth() auth: AuthResult,
  ) {
    return this.service.addComment(body, auth);
  }
}
