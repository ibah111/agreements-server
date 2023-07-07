import { Controller, Get, HttpCode } from '@nestjs/common';
import { CollectorService } from './Collector.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Collector')
@Controller('collector')
export class CollectorController {
  constructor(private collertorService: CollectorService) {}
  @Get()
  @HttpCode(200)
  async getAllCollectors() {
    return await this.collertorService.getAllCollectors();
  }
}
