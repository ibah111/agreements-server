import axios from 'axios';
import { AuthUser, AuthUserError, AuthUserSuccess } from './auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import client from 'src/utils/client';
import bitrix from 'src/utils/bitrix';
import serverConfig from '../../config/bitrix.json';

export const checkLogin = async (token: string) => {
  if (!serverConfig.checkToken)
    return {
      output: 'Вы вошли',
      id: '4018',
      login_result: true,
      login: 'baledin@zakon43.ru',
      birthdate: '18.10.2001',
      department: 'Группа разработки',
      position: 'Младший разработчик',
      firstname: 'Иван',
      secondname: 'Балезин',
      thirdname: '',
      avatar:
        '/upload/main/9d0/tjpf6q3grm1vizfpfg68lfbf1ercp5x5/photo1656529238.png',
    };
  if (!token) {
    return false;
  }
  // Тестируем систему................................
  if (client('demo'))
    return !Number.isNaN(token)
      ? ({
          login_result: true,
          id: token,
          login: 'smorkalov@zakon43.ru',
        } as unknown as AuthUserSuccess)
      : ({ login_result: false } as AuthUserError);
  try {
    const result = await axios.get<AuthUser<boolean>>(
      bitrix('oauth') + '/oauth/login',
      { headers: { token } },
    );

    if (result.data === undefined || result.data === null) {
      return false;
    } else {
      if (result.data.login_result === true) {
        return result.data as AuthUserSuccess;
      } else {
        return result.data as AuthUserError;
      }
    }
  } catch (err) {
    throw new UnauthorizedException({
      message: 'Не удалось прочитать токен доступа',
      code: 'error_token',
    });
  }
};
