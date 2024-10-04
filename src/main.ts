import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Start listening on port 3001 (or any port you're using)
  await app.listen(3001);
  Logger.log('Nest application successfully started on port 3001');

  // Graceful shutdown on SIGTERM/SIGINT (e.g., when restarting in watch mode)
  process.on('SIGTERM', async () => {
    Logger.log('SIGTERM signal received: closing NestJS application...');
    await app.close();
    Logger.log('NestJS application closed');
  });

  process.on('SIGINT', async () => {
    Logger.log('SIGINT signal received: closing NestJS application...');
    await app.close();
    Logger.log('NestJS application closed');
  });

}

bootstrap();
