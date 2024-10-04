// src/app.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { WorkflowClient, Connection, Client } from '@temporalio/client';
import { run } from './temporal/worker';
import { v4 as uuidv4 } from 'uuid';
import { example } from './temporal/workflows';
@Injectable()
export class AppService implements OnModuleInit {
  private client;
  private connection;

  async onModuleInit() {
    try{
    this.connection = await Connection.connect({ address: 'localhost:7233' });
    this.client = new Client({
      connection: this.connection,
      // namespace: 'foo.bar', // connects to 'default' namespace if not specified
    });
    await run().catch((err) => {
      console.error(err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Failed to initialize Temporal worker or client:', err);
  }
  }
  async startOrderWorkflow(orderId: string) {
    try {
      const workflowId = 'workflow-'+ uuidv4();

      console.log("🎖️🎖️  ⚔️  workflow starting for id 🎖️🎖️", workflowId)

      const handle = await this.client.workflow.start(example, {
        taskQueue: 'my-task-queue',
        args: [orderId],
        workflowId: workflowId,
      });
      console.log("🎖️🎖️  ⚔️  workflow completed for id 🎖️🎖️", workflowId)
      return handle;
    } catch (error) {
      console.log(
        '🎖️🎖️  ⚔️  file: app.service.ts:34  ⚔️  AppService  ⚔️  startOrderWorkflow  ⚔️  error 🎖️🎖️',
        error,
      );

      throw new Error(
        `Got exception while starting workflow: ` + error.message,
      );
    }
  }

  async onModuleDestroy() {
    try {
      // Close Temporal connection gracefully
      await this.connection.close();
      console.log('Temporal connection closed successfully');
    } catch (error) {
      console.error('Error during Temporal connection shutdown:', error);
    }
  }
}
