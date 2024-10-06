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

  // this example shows a simple use case of temporal workflow implementation where a workflow is started which contains 2 console statements separated by a sleep statement which puts the workflow to sleep releasing majority of the used resources and then wakes up to continue the process once sleep time has lapsed, post wake-up, an activity function has been executed
  @Post('usecase-1')
  async useCaseOne(@Body('orderId') orderId: string) {
    Logger.log('usecase-1 api called');
    return await this.appService.useCaseOne(orderId);
  }

  @Post('usecase-2')
  async useCaseTwo(@Body() payload: any) {
    Logger.log('usecase-2 api called');
    return await this.appService.useCaseTwo(payload);
  }

  @Post('usecase-2-util-1')
  async useCaseTwoUtilOne(@Body() payload: any) {
    Logger.log('usecase-2-util-1 api called');
    return await this.appService.useCaseTwoUtilOne(payload);
  }
}
