import { getConnectionToken } from '@sql-tools/nestjs-sequelize';
import { Model } from '@sql-tools/sequelize-typescript';
import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  ImATeapotException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ClassConstructor } from 'class-transformer';
import { User } from '../Database/Local.Database/models/User.model';
import { checkLogin } from './check_login';
export class AuthUser<T extends boolean> {
  output: T extends true ? 'Вы вошли' : 'Вы не вошли';
  error: T extends false ? string : never;
  id: T extends true ? number : never;
  login: T extends true ? string : never;
  login_result: T;
  birthdate: T extends true ? string : never;
  department: T extends true ? string : never;
  position: T extends true ? string : never;
  firstname: T extends true ? string : never;
  secondname: T extends true ? string : never;
  thirdname: T extends true ? string : never;
}
export class AuthUserSuccess extends AuthUser<true> {}
export class AuthUserError extends AuthUser<false> {}
export class AuthResult {
  user: AuthUserSuccess;
  userLocal: User;
}
export const Auth = createParamDecorator(
  async (_data: string, ctx: ExecutionContext) => {
    const data = ctx.switchToHttp().getRequest();
    if (data.user) {
      return data.user;
    }
    throw new UnauthorizedException({
      message: 'Вы не авторизованы',
    });
  },
);
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly modelUser = this.getRepository(User);
  constructor(private moduleRef: ModuleRef) {}
  private getRepository<T extends Model>(model: ClassConstructor<T>) {
    const connection = this.moduleRef.get(getConnectionToken('local'), {
      strict: false,
    });
    return connection.getRepository<T>(model);
  }

  async canActivate(ctx: ExecutionContext) {
    const data = ctx.switchToHttp().getRequest();
    const body = data.headers;
    if (body) {
      const { token } = body;
      const result = await checkLogin(token);
      if (result) {
        if (result?.login_result) {
          const user: AuthResult = {
            user: result,
            userLocal:
              (await this.modelUser.findOne({
                where: { login: result.login },
                include: ['Roles'],
              })) ||
              (await this.modelUser.findOne({
                where: { login: 'guest' },
                rejectOnEmpty: new ImATeapotException('Забыл добавить гостя'),
                include: ['Roles'],
              })),
          };
          data.user = user;
          return true;
        } else {
          throw new UnauthorizedException(result as AuthUserError);
        }
      }
    }
    throw new UnauthorizedException({
      message: 'Пустой или неправильный токен',
    });
  }
}
