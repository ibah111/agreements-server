import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import { DictInput } from './Dict.input';
import { DictService } from './Dict.service';

@ApiTags('Dict')
@Controller('dict')
@UseGuards(AuthGuard)
export class DictController {
  constructor(private dictService: DictService) {}
  @Post()
  @HttpCode(200)
  async dict(@Body() body: DictInput) {
    return await this.dictService.dict(body);
  }
}
