import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  DeleteUser,
  EditUser,
  HomeCreateUser,
  HomeGetUser,
  HomeLogin,
} from './Home.input';
import { HomeService } from './Home.service';
@ApiTags('Home')
@Controller('Home')
export class HomeController {
  private readonly service: HomeService;

  constructor(service: HomeService) {
    this.service = service;
  }
  @Post('CreateUser')
  async createUser(@Body() body: HomeCreateUser) {
    return await this.service.addUser({ data: body });
  }

  @Get('getUsers')
  getUsers() {
    return this.service.getUsers();
  }
  @Post('editUser')
  editUser(@Body() index: EditUser) {
    return this.service.editUser(index);
  }
  @Get('getUser/:id')
  getUser(@Param('id') index: number) {
    return this.service.getUser(index);
  }
  @Post('DELETE/:id')
  deleteUser(@Param('id') index: number) {
    return this.service.deleteUser(index);
  }
  @Post('Login')
  login(@Body() body: HomeLogin) {
    return this.service.login(body);
  }
}
