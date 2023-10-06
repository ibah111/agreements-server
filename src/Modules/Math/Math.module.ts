import { Module } from '@nestjs/common';
import MathService from './Math.service';

@Module({
  providers: [MathService],
  exports: [MathService],
})
export class MathModule {}
