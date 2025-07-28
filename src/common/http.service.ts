import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '../config/winston.config';

@Injectable()
export class HttpService {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(url, config);
      return response.data;
    } catch (error) {
      logger.error(`GET ${url} failed: ${error.message}`);
      throw error;
    }
  }

  async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post(url, data, config);
      return response.data;
    } catch (error) {
      logger.error(`POST ${url} failed: ${error.message}`);
      throw error;
    }
  }
}
