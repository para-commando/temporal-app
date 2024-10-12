// src/temporal/temporal.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Connection, Client } from '@temporalio/client';
import { Logger } from '@nestjs/common';

@Injectable()
export class TemporalService implements OnModuleInit, OnModuleDestroy {
  private client: Client;
  private connection: Connection;

  async onModuleInit() {
    try {
      this.connection = await Connection.connect({ address: 'localhost:7233' });
      this.client = new Client({
        connection: this.connection,
    //    namespace: 'default', // connects to 'default' namespace if not specified
      });

      Logger.log('Temporal client initialized successfully.');
    } catch (err) {
      Logger.error('Failed to initialize Temporal worker or client:', err);
    }
  }

  getClient(): Client {
    return this.client;
  }

  async onModuleDestroy() {
    try {
      await this.connection.close();
      Logger.log('Temporal connection closed successfully.');
    } catch (error) {
      Logger.error('Error during Temporal connection shutdown:', error);
    }
  }
}
