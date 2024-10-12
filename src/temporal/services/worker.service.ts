// src/temporal/temporal.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { NativeConnection, Worker } from '@temporalio/worker';
import * as useCaseOneActivities from '../usecase-one/use-case-one.activities';
import * as useCaseTwoActivities from '../usecase-two/use-case-two.activities';
import * as useCaseThreeActivities from '../usecase-three/use-case-three.activities';

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
  private workerOne: Worker;
  private workerTwo: Worker;
  private workerThree: Worker;
  private connection: NativeConnection;

  async onModuleInit() {
    try {
      Logger.log('Initializing workers:');

      this.connection = await NativeConnection.connect({
        address: 'localhost:7233',
        // TLS and gRPC metadata configuration goes here.
      });

      Logger.log('initializing workerOne');

      this.workerOne = await Worker.create({
        connection: this.connection,
        namespace: 'default',
        taskQueue: 'use-case-one-task-queue',
        // Workflows are registered using a path as they run in a separate JS context.
        workflowsPath: require.resolve(
          '../usecase-one/use-case-one-parent-workflows',
        ),
        activities: useCaseOneActivities,
      });
      Logger.log('workerOne initialized successfully');

      Logger.log('initializing workerTwo');

      this.workerTwo = await Worker.create({
        connection: this.connection,
        namespace: 'default',
        taskQueue: 'use-case-two-task-queue',
        // Workflows are registered using a path as they run in a separate JS context.
        workflowsPath: require.resolve(
          '../usecase-two/use-case-two-parent-workflows',
        ),
        activities: useCaseTwoActivities,
      });
      Logger.log('workerTwo initialized successfully');


      Logger.log('initializing workerThree');

      this.workerThree = await Worker.create({
        connection: this.connection,
        namespace: 'default',
        taskQueue: 'use-case-three-task-queue',
        // Workflows are registered using a path as they run in a separate JS context.
        workflowsPath: require.resolve(
          '../usecase-three/use-case-three-parent-workflows',
        ),
        activities: useCaseThreeActivities,
      });
      Logger.log('workerThree initialized successfully');

      Logger.log('Starting initialized workers');

      Promise.all([this.workerOne.run(), this.workerTwo.run(), this.workerThree.run()]);

      Logger.log('Workers started successfully');
    } catch (err) {
      Logger.error('Failed to initialize a worker:', err);
      process.exit(1);
    }
  }

  // getWorker(): Worker {
  //   return this.worker;
  // }

  async onModuleDestroy() {
    try {
      Logger.log('Shutting down Temporal workers...');
      await Promise.all([this.workerOne.shutdown(), this.workerTwo.shutdown(),this.workerThree.shutdown()]);
      Logger.log('Workers shut down successfully.');

      Logger.log('Closing Temporal connection...');
      await this.connection.close();
      Logger.log('Temporal connection closed successfully.');
    } catch (error) {
      Logger.error(
        'Error during Temporal connection shutdown in WorkerService:',
        error,
      );
      process.exit(1);
    }
  }
}
