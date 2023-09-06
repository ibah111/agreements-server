import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './Comment.service';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { CommentInput } from './Comment.input';
import { Auth, AuthGuard, AuthResult } from 'src/Modules/Guards/auth.guard';
import { CanGuard } from 'src/Modules/Casl/Can.guard';
@ApiTags('Comments')
@Controller('Comments')
@UseGuards(CanGuard)
@UseGuards(AuthGuard)
@ApiBasicAuth()
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post()
  addComment(@Body() body: CommentInput, @Auth() auth: AuthResult) {
    return this.service.addComment(body, auth);
  }

  @Get('/:id_agreement')
  getCommentOfAgreement(
    @Param('id_agreement', ParseIntPipe) id_agreement: number,
  ) {
    return this.service.getAll(id_agreement);
  }

  @Delete('deleteComment/:id_comment')
  deleteComment(@Param('id_comment', ParseIntPipe) id_comment: number) {
    return this.service.deleteComment(id_comment);
  }

  @Patch('patchComment/:id_comment')
  patchComment(
    @Param('id_comment', ParseIntPipe) id_comment: number,
    @Body() body: CommentInput,
  ) {
    return this.service.patchComment(id_comment, body);
  }
}
