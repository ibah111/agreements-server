import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { CaslAbilityFactory } from 'src/Modules/Casl/casl-ability.factory';
import { User } from 'src/Modules/Database/Local.Database/models/User.model';
import { RoleInput, AddUserInput, RemoveUserInput } from './User.input';

export class UserService {
  constructor(
    @InjectModel(User, 'local') private readonly modelUser: typeof User,
    private readonly ability: CaslAbilityFactory,
  ) {}

  async createUser(data: AddUserInput) {
    const User = await this.modelUser.create({
      login: data.login,
    });
    return User;
  }
  async destroyUser(body: RemoveUserInput) {
    await this.modelUser.destroy({ where: { id: body.id } });
  }
  async addRole(body: RoleInput) {
    const user = await this.modelUser.findOne({
      where: { id: body.user_id },
      rejectOnEmpty: new NotFoundException('Пользователь не найден'),
    });
    await user.addRole(body.role_id);
  }
  async removeRole(body: RoleInput) {
    const user = await this.modelUser.findOne({
      where: { id: body.user_id },
      rejectOnEmpty: new NotFoundException('Пользователь не найден'),
    });
    await user.removeRole(body.role_id);
  }
}
