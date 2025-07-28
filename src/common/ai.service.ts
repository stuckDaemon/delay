import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { HttpService } from './http.service';
import { logger } from 'src/config/winston.config';

dotenv.config();

@Injectable()
export class AiService {
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly fallbackMessage =
    'We’re experiencing some traffic delays and your delivery might arrive later than expected. Thank you for your patience!';

  constructor(private readonly http: HttpService) {}

  async generateIncreasedDelayMessage(name: string, delay: number) {
    return this.generateFromPrompt(
      `Let ${name} know the traffic delay has increased to ${delay} minutes.`,
    );
  }

  async generateReducedDelayMessage(name: string, delay: number) {
    return this.generateFromPrompt(
      `Let ${name} know the delay has decreased. New estimated delay is ${delay} minutes.`,
    );
  }

  async generateClearDelayMessage(name: string) {
    return this.generateFromPrompt(
      `Inform ${name} that the delay has cleared and the delivery is now back on track.`,
    );
  }

  private async generateFromPrompt(prompt: string): Promise<string> {
    return this.generateMessage(prompt, 0); // reuses core method
  }

  async generateMessage(customerName: string, delayMinutes: number): Promise<string> {
    const prompt = `You're a friendly assistant. Write a short SMS message to ${customerName || 'the customer'} letting them know their delivery will be delayed by ${delayMinutes} minutes due to traffic. Be polite and reassuring.`;

    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You generate delivery delay notifications via SMS.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    };

    const headers = {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await this.http.post<any>(this.apiUrl, body, { headers });
      const message = response.choices?.[0]?.message?.content?.trim();

      if (message) {
        logger.info(`Generated message: ${message}`);
        return message;
      } else {
        logger.warn('AI response missing content. Using fallback.');
        return this.fallbackMessage;
      }
    } catch (err) {
      logger.error(`OpenAI request failed: ${err.message}`);
      return this.fallbackMessage;
    }
  }
}
