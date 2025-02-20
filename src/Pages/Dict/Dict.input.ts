import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DictInput {
  @IsNumber()
  @Expose()
  id: number;
}
