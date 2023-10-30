import { Module } from '@nestjs/common';
import { ContactLogService } from './contact-log.service';

@Module({
  providers: [ContactLogService],
})
export class ContactLogModule {}
