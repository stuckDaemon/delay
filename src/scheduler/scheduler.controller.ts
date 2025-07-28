import { Controller, Get } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  // Only for debugging reasons
  @Get()
  async run() {
    await this.schedulerService.checkTrafficConditions();
  }
}
