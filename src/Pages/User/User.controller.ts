import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { CheckCan } from 'src/Modules/Casl/Can.decorators';
import { CanGuard } from 'src/Modules/Casl/Can.guard';
import { Action } from 'src/Modules/Casl/casl-ability.factory';
import { User } from 'src/Modules/Database/Local.Database/models/User.model';
import { User_Role } from 'src/Modules/Database/Local.Database/models/User_Role.model';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import { RoleInput, AddUserInput, RemoveUserInput } from './User.input';
import { UserService } from './User.service';

@UseGuards(CanGuard)
@UseGuards(AuthGuard)
@ApiTags('User')
@Controller('User')
@ApiBasicAuth()
export class UserController {
  constructor(private readonly service: UserService) {}

  @CheckCan((ability) => ability.can(Action.Create, User))
  @Post()
  createUser(@Body() body: AddUserInput) {
    return this.service.createUser(body);
  }

  @CheckCan((ability) => ability.can(Action.Delete, User))
  @Delete()
  destroyUser(@Body() body: RemoveUserInput) {
    return this.service.destroyUser(body);
  }
  @CheckCan((ability) => ability.can(Action.Create, User_Role))
  @Post('role')
  addRole(@Body() body: RoleInput) {
    return this.service.addRole(body);
  }
  @CheckCan((ability) => ability.can(Action.Delete, User_Role))
  @Delete('role')
  removeRole(@Body() body: RoleInput) {
    return this.service.removeRole(body);
  }

  @Get('getAllRoles')
  getAllROles() {
    return this.service.getAllRoles();
  }
}
