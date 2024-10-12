import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable graceful shutdown hooks for the app to trigger onModuleDestroy
    app.enableShutdownHooks();

  await app.listen(3001);
  Logger.log('Nest application successfully started on port 3001');

  // process.on('SIGTERM', async () => {
  //   Logger.log('SIGTERM signal received: closing application...');
  //   await app.close();
  //   Logger.log('Application closed.');
  //   process.exit(0);
  // });

  // process.on('SIGINT', async () => {
  //   Logger.log('SIGINT signal received: closing application...');
  //   await app.close();
  //   Logger.log('Application closed.');
  //   process.exit(0);
  // });

}

bootstrap();
