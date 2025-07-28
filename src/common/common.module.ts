import { Module } from '@nestjs/common';
import { HttpService } from './http.service';
import { AiService } from './ai.service';
import { NotificationService } from './notification.service';
import { TrafficService } from './traffic.service';

@Module({
  providers: [HttpService, AiService, NotificationService, TrafficService],
  exports: [HttpService, AiService, NotificationService, TrafficService],
})
export class CommonModule {}
