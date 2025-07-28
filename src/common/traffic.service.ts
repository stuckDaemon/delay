import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { HttpService } from './http.service';
import { logger } from '../config/winston.config';

dotenv.config();

@Injectable()
export class TrafficService {
  private readonly MAPBOX_URL = 'https://api.mapbox.com/directions/v5/mapbox/driving';

  constructor(private readonly httpService: HttpService) {}

  async getDelay(origin: string, destination: string): Promise<number> {
    const useMock = process.env.USE_MOCK_TRAFFIC === 'true';

    if (useMock) {
      const delay = Math.floor(Math.random() * 60); // random delay in minutes
      logger.info(`[MOCK] Returning random delay: ${delay} min`);
      return delay;
    }

    try {
      const coordinates = await this.geocodeCoordinates(origin, destination);
      const url = `${this.MAPBOX_URL}/${coordinates}?access_token=${process.env.MAPBOX_TOKEN}&overview=false&annotations=duration`;

      const data = await this.httpService.get<any>(url);

      const durationInSeconds = data.routes[0]?.duration ?? 0;
      const delayMinutes = Math.round(durationInSeconds / 60);

      logger.info(`Delay for route ${origin} → ${destination}: ${delayMinutes} min`);
      return delayMinutes;
    } catch (err) {
      logger.error(`Error getting delay: ${err.message}`);
      return 0;
    }
  }

  // Simplified mock geocoding (just use raw coordinates for now)
  private async geocodeCoordinates(origin: string, destination: string): Promise<string> {
    // In real-world: use Mapbox Geocoding API here
    // For now assume origin and destination are already "lng,lat"
    return `${origin};${destination}`;
  }
}
