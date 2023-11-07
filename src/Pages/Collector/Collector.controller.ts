import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CollectorService } from './Collector.service';
import { ApiTags } from '@nestjs/swagger';
import { SearchUserInput } from './Collector.input';

@ApiTags('Collector')
@Controller('collector')
export class CollectorController {
  constructor(private collertorService: CollectorService) {}
  @Get()
  @HttpCode(200)
  async getAllCollectors() {
    return await this.collertorService.getAllCollectors();
  }

  @Post('/searchUser')
  async searchUser(@Body() body: SearchUserInput) {
    return await this.collertorService.searchUser(body.fio);
  }
}
