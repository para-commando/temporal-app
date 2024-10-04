// src/app.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('orders')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/status-check')
  async statusCheck() {
    return 'All good!';
  }
  @Post('start')
  async startOrder(@Body('orderId') orderId: string) {
    return await this.appService.startOrderWorkflow(orderId);
  }
}
