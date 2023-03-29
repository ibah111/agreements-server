import { IsString } from 'class-validator';

export class SearchInput {
  @IsString()
  // * name
  name: string;
  @IsString()
  // * KD
  contract: string;
}
