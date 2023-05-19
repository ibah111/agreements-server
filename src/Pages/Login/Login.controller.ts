import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Auth, AuthGuard, AuthResult } from 'src/Modules/Guards/auth.guard';
@UseGuards(AuthGuard)
@Controller('login')
export class LoginController {
  @HttpCode(200)
  @Post()
  login(@Auth() auth: AuthResult) {
    return {
      ...auth.user,
      roles: auth.userLocal?.Roles?.map((item) => item.name) || [],
    };
  }
}
