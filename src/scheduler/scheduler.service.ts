import { Injectable } from '@nestjs/common';
import { logger } from '../config/winston.config';
import { Delivery } from '../models/delivery.model';
import { TrafficService } from 'src/common/traffic.service';
import { AiService } from 'src/common/ai.service';
import { NotificationService } from '../common/notification.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly traffic: TrafficService,
    private readonly ai: AiService,
    private readonly notify: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkTrafficConditions(): Promise<void> {
    const deliveries: Delivery[] = await Delivery.findAll({
      where: { delivered: false },
    });
    logger.info(`Processing ${deliveries.length} deliveries`);

    const tasks = deliveries.map(async (delivery) => {
      const delayMinutes = await this.traffic.getDelay(delivery.origin, delivery.destination);
      const previousDelay = delivery.lastKnownDelay ?? null;

      const name = delivery.customerName;
      const contact = delivery.contact;

      // CASE 1: No delay now, but we had one before → delay cleared
      if (delayMinutes <= 0 && previousDelay && previousDelay > 0) {
        const message = await this.ai.generateClearDelayMessage(name);
        await this.notify.send(contact, message);
        logger.info(`[DELAY CLEARED] Notified ${name}: ${message}`);
      }

      // CASE 2: First delay
      else if (previousDelay === null && delayMinutes > 30) {
        const message = await this.ai.generateMessage(name, delayMinutes);
        await this.notify.send(contact, message);
        logger.info(`[FIRST DELAY] Notified ${name}: ${message}`);
      }

      // CASE 3: Delay increased significantly
      else if (previousDelay !== null && delayMinutes > previousDelay + 5) {
        const message = await this.ai.generateIncreasedDelayMessage(name, delayMinutes);
        await this.notify.send(contact, message);
        logger.info(`[DELAY INCREASED] Notified ${name}: ${message}`);
      }

      // CASE 4: Shorter but still a delay
      else if (previousDelay && delayMinutes > 0 && delayMinutes < previousDelay - 5) {
        const message = await this.ai.generateReducedDelayMessage(name, delayMinutes);
        await this.notify.send(contact, message);
        logger.info(`[DELAY REDUCED] Notified ${name}: ${message}`);
      }

      // CASE 5: No change or no action needed
      else {
        logger.info(`[NO ACTION] ${name} – Delay: ${delayMinutes}min (previous: ${previousDelay})`);
      }

      // Always update the new delay in DB
      await delivery.update({ lastKnownDelay: delayMinutes });
    });
    await Promise.all(tasks);
  }
}
