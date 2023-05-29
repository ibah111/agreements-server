import { IsNumber } from 'class-validator';

export class DictInput {
  @IsNumber()
  id: number;
}
