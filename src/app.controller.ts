// src/app.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from '@nestjs/common';
    
@Controller('orders')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('*') // This could catch all routes and prevent '/status' from being hit
  // findAll() {
  //   return 'This route catches everything';
  // }
  @Get('status')
  async statusCheck() {
   Logger.log('status check api invoked');
    return 'All good!';
  }
  @Post('start')
  async startOrder(@Body('orderId') orderId: string) {
    Logger.log('start api called');

    return await this.appService.startOrderWorkflow(orderId);
  }
}
