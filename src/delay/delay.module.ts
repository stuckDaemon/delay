import { Module } from '@nestjs/common';
import { DelayService } from './delay.service';
import { DelayController } from './delay.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [DelayController],
  providers: [DelayService],
  exports: [DelayService],
})
export class DelayModule {}
