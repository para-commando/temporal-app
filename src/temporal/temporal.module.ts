import { Module } from '@nestjs/common';
import { TemporalService } from './services/temporal.service';
import { WorkerService } from './services/worker.service';

@Module({
  exports: [TemporalService, WorkerService],
  imports: [],
  controllers: [],
  providers: [TemporalService, WorkerService],
})
export class TemporalModule {}
