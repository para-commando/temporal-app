import { WorkflowClient } from '@temporalio/client';
import { sleep } from '@temporalio/workflow';

/** Ship Order Activity */
export async function shipOrder(orderId: string, childWorkflowId: string, parentWorkflowId: string): Promise<void> {
  console.log('entered shiporder activity');

   await sleep(3000);
   console.log('returning from shiporder activity');

   return;
}
