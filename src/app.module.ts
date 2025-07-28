import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DelayModule } from './delay/delay.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { dataBaseConfig } from './config/database/database.config';
import { SchedulerModule } from './scheduler/scheduler.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    SequelizeModule.forRoot(dataBaseConfig),
    ConfigModule.forRoot(),
    DelayModule,
    SchedulerModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
