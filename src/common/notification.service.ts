import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';
import * as dotenv from 'dotenv';
import { logger } from '../config/winston.config';

dotenv.config();

@Injectable()
export class NotificationService {
  private readonly client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  private readonly from = process.env.TWILIO_PHONE_NUMBER;

  async send(to: string, message: string): Promise<void> {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.from,
        to,
      });

      logger.info(`Notification sent to ${to} (SID: ${result.sid})`);
    } catch (err) {
      logger.error(`Failed to send SMS to ${to}: ${err.message}`);
    }
  }
}
