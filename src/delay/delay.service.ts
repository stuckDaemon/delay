import { Injectable, NotFoundException } from '@nestjs/common';
import { Delivery } from 'src/models/delivery.model';
import { CreateDeliveryDto } from './dto/create-delay.dto';
import { UpdateDeliveryDto } from './dto/update-delay.dto';

@Injectable()
export class DelayService {
  constructor() {}

  async createDelivery(dto: CreateDeliveryDto): Promise<Delivery> {
    return await Delivery.create({
      customerName: dto.customerName,
      contact: dto.contact,
      origin: dto.origin,
      destination: dto.destination,
    });
  }

  async updateDelivery(dto: UpdateDeliveryDto): Promise<Delivery> {
    if (!dto.id) throw new Error('Missing delivery ID in update DTO');
    const delivery = await Delivery.findByPk(dto.id);
    if (!delivery) throw new NotFoundException('Delivery not found');

    return await delivery.update(dto);
  }
}
