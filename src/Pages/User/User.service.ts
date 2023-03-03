import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { models } from 'src/Modules/Database/Local.Database/models';
import { Role } from 'src/Modules/Database/Local.Database/models/Role.model';
import { User } from 'src/Modules/Database/Local.Database/models/User.model';
import { User_Role } from 'src/Modules/Database/Local.Database/models/User_Role.model';
import { DeleteUser, EditUser, UserAdd } from './User.input';

export class UserService {
  constructor(@InjectModel(User) private readonly userService: typeof User) {}

  async addUser(data: UserAdd) {
    const User = await this.userService.create({
      login: data.login,
    });
    return User;
  }
  async deleteUser(id: number) {
    const user = await this.userService.findByPk(id);
    if (user) {
      console.log('user has been destroyed');
      return user.destroy();
    } else {
      throw new NotFoundException("user hasn't been destroyed ");
    }
  }
  async editUser(data: EditUser) {
    const name = await this.userService.update(
      {
        [data.field]: data.value,
      },
      { where: { id: data.id } },
    );
    return true;
  }
}
