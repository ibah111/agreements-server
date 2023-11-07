import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CollectorService } from './Collector.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCollectorInput, SearchUserInput } from './Collector.input';

@ApiTags('Collector')
@Controller('collector')
export class CollectorController {
  constructor(private collertorService: CollectorService) {}
  @Get()
  @HttpCode(200)
  async getAllCollectors() {
    return await this.collertorService.getAllCollectors();
  }

  @Get('/getAllAddedCollectors')
  async getAllAdded() {
    return await this.collertorService.getAllAddedColletors();
  }
  @Post('/searchUser')
  async searchUser(@Body() body: SearchUserInput) {
    return await this.collertorService.searchUser(body.fio);
  }

  @Post('/createCollector')
  async createCollector(@Body() body: CreateCollectorInput) {
    return await this.collertorService.addCollector(body);
  }
}
