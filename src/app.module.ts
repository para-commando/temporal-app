import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TemporalModule } from './temporal/temporal.module';

@Module({
  imports: [TemporalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
