import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchInput } from './Search.input';
import { SearchService } from './Search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Post()
  @HttpCode(200)
  async search(@Body() body: SearchInput) {
    return await this.searchService.search(body.fio, body.contract);
  }
}
