// src/temporal/temporal.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Connection, Client } from '@temporalio/client';
import { Logger } from '@nestjs/common';
import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
  private worker: Worker;
  private connection: NativeConnection;

  async onModuleInit() {
    try {
      Logger.log('Initializing a worker:');
      this.connection = await NativeConnection.connect({
        address: 'localhost:7233',
        // TLS and gRPC metadata configuration goes here.
      });
      // Step 2: Register Workflows and Activities with the Worker.
      this.worker = await Worker.create({
        connection:this.connection,
        namespace: 'default',
        taskQueue: 'my-task-queue',
        // Workflows are registered using a path as they run in a separate JS context.
        workflowsPath: require.resolve('./workflows'),
        activities,
      });
      Logger.log('worker initialized successfully');

      Logger.log('Starting worker');

      this.worker.run();
    } catch (err) {
      Logger.error('Failed to initialize a worker:', err);
    }
  }

  // getWorker(): Worker {
  //   return this.worker;
  // }

  async onModuleDestroy() {
    try {
      await this.worker.shutdown();
      await this.connection.close();
      Logger.log('Temporal connection closed successfully.');
    } catch (error) {
      Logger.error('Error during Temporal connection shutdown in workerService:', error);
    }
  }
}
