import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsNumberOrString } from 'src/Modules/Validator/IsNumberOrString.validator';

export class UserAdd {
  @ApiProperty()
  login: string;
}
export class DeleteUser {
  @ApiProperty()
  @IsNumber()
  index: number;
}
export class EditUser {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  field: string;

  @IsNumberOrString()
  value: string | number;
}
