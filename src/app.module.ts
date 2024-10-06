import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TemporalService } from './temporal/temporal.service';
import { WorkerService } from './temporal/worker.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TemporalService, WorkerService],
})
export class AppModule {}
