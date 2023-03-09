import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsNumberOrString } from 'src/Modules/Validator/IsNumberOrString.validator';

export class AddUserInput {
  @Expose()
  @ApiProperty()
  @IsEmail()
  login: string;
}
export class RemoveUserInput {
  @Expose()
  @ApiProperty()
  @IsNumber()
  id: number;
}
export class RoleInput {
  @Expose()
  @ApiProperty()
  @IsNumber()
  user_id: number;
  @Expose()
  @ApiProperty()
  @IsNumber()
  role_id: number;
}
