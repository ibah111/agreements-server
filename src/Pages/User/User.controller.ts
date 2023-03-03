import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EditUser, UserAdd } from './User.input';
import { UserService } from './User.service';

@ApiTags('User')
@Controller('User')
export class DebtController {
  constructor(private readonly service: UserService) {}

  @Post('AddUser')
  async addUser(@Body() body: UserAdd) {
    return await this.service.addUser(body);
  }
  @Delete('DELETE/:id')
  async deleteUser(@Param('id') id: number) {
    return this.service.deleteUser(id);
  }
  @Post('EditUser')
  editUser(@Body() index: EditUser) {
    return this.service.editUser(index);
  }
}
