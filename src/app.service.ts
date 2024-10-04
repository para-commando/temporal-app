// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { TemporalService } from './temporal.service'; // Import the new service
import { v4 as uuidv4 } from 'uuid';
import { example } from './temporal/workflows';
import { Logger } from '@nestjs/common';


@Injectable()
export class AppService {
  constructor(
    private readonly temporalService: TemporalService,
  ) {}

  async startOrderWorkflow(orderId: string) {
    try {
      const workflowId = 'workflow-' + uuidv4();
      Logger.log(`🎖️🎖️  ⚔️  workflow starting for id ${workflowId} 🎖️🎖️`);

      const client = this.temporalService.getClient();
      const handle = await client.workflow.start(example, {
        taskQueue: 'my-task-queue',
        args: [orderId],
        workflowId: workflowId,
      });

      return 'workflow started successfully with id ' + workflowId;
    } catch (error) {
      Logger.error(
        '🎖️🎖️  ⚔️  file: app.service.ts:34  ⚔️  AppService  ⚔️  startOrderWorkflow  ⚔️  error 🎖️🎖️',
        error,
      );
      throw new Error(
        `Got exception while starting workflow: ` + error.message,
      );
    }
  }
}
