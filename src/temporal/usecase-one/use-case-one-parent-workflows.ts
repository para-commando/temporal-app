// src/temporal/workflows.ts
import { proxyActivities, sleep } from '@temporalio/workflow';
import { greet } from './use-case-one-configuredActivities';

/** A workflow that simply calls an activity */
export async function useCaseOneWorkflow(orderId: string): Promise<string> {
  // Step 1: Place the order
  console.log(`Placing order for ID: ${orderId}`);

  // Step 2: Wait for 50 seconds
  await sleep('50000');

  // Step 3: Proceed to shipping
  console.log(`Shipping order for ID: ${orderId}`);
  return await greet(orderId);
}
