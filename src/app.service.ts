// src/app.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { TemporalService } from './temporal/services/temporal.service'; // Import the new service
import { v4 as uuidv4 } from 'uuid';
import { useCaseOneWorkflow } from './temporal/usecase-one/use-case-one-parent-workflows';
import { useCaseTwoWorkflow } from './temporal/usecase-two/use-case-two-parent-workflows';
import { Logger } from '@nestjs/common';
import { Client } from '@temporalio/client';
import { defineSignal } from '@temporalio/workflow';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly temporalService: TemporalService) {}
  private client: Client ;

  onModuleInit() {
    this.client = this.temporalService.getClient();
  }

  async useCaseOne(orderId: string) {
    try {
      const workflowId = 'workflow-one-' + uuidv4();
      Logger.log(`🎖️🎖️  ⚔️  workflow starting for id ${workflowId} 🎖️🎖️`);

      const handle = await this.client.workflow.start(useCaseOneWorkflow, {
        taskQueue: 'use-case-one-task-queue',
        args: [orderId],
        workflowId: workflowId,
      });

      return 'workflow started successfully with id ' + workflowId;
    } catch (error) {
      Logger.error(
        '🎖️🎖️  ⚔️  file: app.service.ts:34  ⚔️  AppService  ⚔️  useCaseOne  ⚔️  error 🎖️🎖️',
        error,
      );
      throw new Error(
        `Got exception while starting workflow: ` + error.message,
      );
    }
  }

  async useCaseTwo(orderId: string) {
    try {
      const workflowId = 'workflow-usecase-two'+ uuidv4();
      Logger.log(`🎖️🎖️  ⚔️  workflow starting for id ${workflowId} 🎖️🎖️`);

      const handle = await this.client.workflow.start(useCaseTwoWorkflow, {
        taskQueue: 'use-case-two-task-queue',
        args: [orderId],
        workflowId: workflowId,
      });

      return handle;
    } catch (error) {
      Logger.error(
        '🎖️🎖️  ⚔️  file: app.service.ts:34  ⚔️  AppService  ⚔️  useCaseTwo  ⚔️  error 🎖️🎖️',
        error,
      );
      throw new Error(
        `Got exception while starting workflow: ` + error.message,
      );
    }
  }

  async useCaseTwoUtilOne(workflowId: string) {
    try {
      const handle = this.client.workflow.getHandle(workflowId);
      await handle.cancel();
    } catch (error) {
      Logger.error(
        '🎖️🎖️  ⚔️  file: app.service.ts:34  ⚔️  AppService  ⚔️  useCaseTwoUtilOne  ⚔️  error 🎖️🎖️',
        error,
      );
      throw new Error(
        `Got exception while cancelling workflow: ` + error.message,
      );
    }
  }

  async useCaseTwoUtilTwo(workflowId: string) {
    try {
      const handle = this.client.workflow.getHandle(workflowId);
      await handle.signal(defineSignal('cancelOrder'));
    } catch (error) {
      Logger.error(
        '🎖️🎖️  ⚔️  file: app.service.ts:34  ⚔️  AppService  ⚔️  useCaseTwoUtilTwo  ⚔️  error 🎖️🎖️',
        error,
      );
      throw new Error(
        `Got exception while signalling workflow: ` + error.message,
      );
    }
  }
}
