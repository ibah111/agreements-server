import { Controller, Get } from '@nestjs/common';
@Controller('guides')
export class GuideController {
  @Get()
  guides() {
    return [];
  }
}
