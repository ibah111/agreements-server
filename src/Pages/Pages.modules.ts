import { Module } from '@nestjs/common';
import { HomePage } from './Home/Home.page';

@Module({
  imports: [HomePage],
})
export class PagesModule {}
