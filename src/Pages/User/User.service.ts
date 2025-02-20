import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { CaslAbilityFactory } from 'src/Modules/Casl/casl-ability.factory';
import { User } from 'src/Modules/Database/Local.Database/models/User.model';
import { RoleInput, AddUserInput, RemoveUserInput } from './User.input';
import { Role } from '../../Modules/Database/Local.Database/models/Role.model';
import { User_Role } from '../../Modules/Database/Local.Database/models/User_Role.model';

export class UserService {
  constructor(
    @InjectModel(User, 'local') private readonly modelUser: typeof User,
    private readonly ability: CaslAbilityFactory,
    @InjectModel(Role, 'local') private readonly modelRole: typeof Role,
    @InjectModel(User_Role, 'local')
    private readonly modelUserRole: typeof User_Role,
  ) {}

  async createUser(data: AddUserInput) {
    const User = await this.modelUser.create({
      login: data.login,
    });
    return User;
  }
  async destroyUser(body: RemoveUserInput) {
    await this.modelUserRole.destroy({
      where: {
        user_id: body.id,
      },
    });
    await this.modelUser.destroy({ where: { id: body.id } });
    return { result: 'success' };
  }
  async addRole(body: RoleInput) {
    const user = await this.modelUser.findOne({
      where: { id: body.user_id },
      rejectOnEmpty: new NotFoundException('Пользователь не найден'),
    });
    await this.modelUserRole.destroy({
      where: {
        user_id: body.user_id,
      },
    });
    await user.addRole(body.role_id);
    return { result: 'success' };
  }
  async removeRole(body: RoleInput) {
    const user = await this.modelUser.findOne({
      where: { id: body.user_id },
      rejectOnEmpty: new NotFoundException('Пользователь не найден'),
    });
    await user.removeRole(body.role_id);
    return { result: 'success' };
  }
  async getAllUsers() {
    const users = await this.modelUser.findAll({});
    return [users, { result: 'success' }];
  }
  async getAllRoles() {
    const roles = await this.modelRole.findAll({});
    return roles;
  }
}
