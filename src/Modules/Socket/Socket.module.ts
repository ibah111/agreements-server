import { Module } from '@nestjs/common';
import { SocketService } from './Socket.service';

@Module({ providers: [SocketService] })
export class SocketModule {}
