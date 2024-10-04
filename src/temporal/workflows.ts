// src/temporal/workflows.ts
import { proxyActivities, sleep } from '@temporalio/workflow';
import type * as activities from './activities';


const { greet } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

/** A workflow that simply calls an activity */
export async function example(orderId: string): Promise<string> {
  // Step 1: Place the order
  console.log(`Placing order for ID: ${orderId}`);

  // Step 2: Wait for cancellation window (7 days)
   await sleep('50000');

  // Step 3: Proceed to shipping
  console.log(`Shipping order for ID: ${orderId}`);
  return await greet(orderId);
}

