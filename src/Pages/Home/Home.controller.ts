import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddPost } from './Home.input';
import { HomeService } from './Home.service';
@ApiTags('Home')
@Controller('Home')
export class HomeController {
  private readonly service: HomeService;

  constructor(service: HomeService) {
    this.service = service;
  }
  @Post('AddPost')
  async createUser(@Body() body: AddPost) {
    return await this.service.addPost({ data: body });
  }
}
