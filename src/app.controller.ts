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

  // this example shows a simple use case of temporal workflow implementation
  @Post('usecase-1')
  async useCaseOne(@Body('orderId') orderId: string) {
    Logger.log('usecase-1 api called');
    return await this.appService.useCaseOne(orderId);
  }
}
