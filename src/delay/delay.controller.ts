import { BadRequestException, Body, Controller, Post, Put } from '@nestjs/common';
import { DelayService } from './delay.service';
import { Delivery } from '../models/delivery.model';
import { CreateDeliveryDto } from './dto/create-delay.dto';
import { UpdateDeliveryDto } from './dto/update-delay.dto';
import { logger } from '../config/winston.config';

@Controller('deliveries')
export class DelayController {
  constructor(private readonly delayService: DelayService) {}

  @Post()
  async create(@Body() dto: CreateDeliveryDto): Promise<Delivery> {
    try {
      return this.delayService.createDelivery(dto);
    } catch (error) {
      logger.error(error);
      throw new BadRequestException(error.message || 'Invalid update payload');
    }
  }

  @Put()
  async update(@Body() dto: UpdateDeliveryDto): Promise<Delivery> {
    try {
      return this.delayService.updateDelivery(dto);
    } catch (error) {
      logger.error(error);
      throw new BadRequestException(error.message || 'Invalid update payload');
    }
  }
}
