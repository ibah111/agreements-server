import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsNumberOrString } from 'src/Modules/Validator/IsNumberOrString.validator';

export class AddUserInput {
  @ApiProperty()
  @IsEmail()
  login: string;
}
export class RemoveUserInput {
  @ApiProperty()
  @IsNumber()
  id: number;
}
export class RoleInput {
  @ApiProperty()
  @IsNumber()
  user_id: number;
  @ApiProperty()
  @IsNumber()
  role_id: number;
}
