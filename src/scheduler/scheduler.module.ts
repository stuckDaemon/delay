import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { DelayModule } from '../delay/delay.module';
import { SchedulerService } from './scheduler.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [DelayModule, CommonModule],
  controllers: [SchedulerController],
  providers: [SchedulerService],
})
export class SchedulerModule {}
