// src/temporal/workflows.ts
import {
  proxyActivities,
  ChildWorkflowHandle,
  defineSignal,
  sleep,
  startChild,
  ParentClosePolicy,
  ChildWorkflowCancellationType,
  setHandler,
} from '@temporalio/workflow';

import { paymentWorkflow } from './use-case-two-child-workflows';
// Define a signal for cancellation
const cancelSignal = defineSignal('cancelOrder');

/** Main Order Processing Workflow */
export async function useCaseTwoWorkflow(orderId: string): Promise<string> {
  let isCanceled = false;

  setHandler(cancelSignal, (args?) => {
    console.log(
      '🎖️🎖️  ⚔️  file: use-case-two-parent-workflows.ts:14  ⚔️  setHandler  ⚔️  args 🎖️🎖️',
      args,
    );

    isCanceled = true;
    console.log('Order has been cancelled:', orderId);
  });

  try {
    // Step 1: Place the order
    console.log(`Order placed for ID: ${orderId}`);

    // Step 2: Start the payment workflow as a child workflow

    // A Parent Close Policy determines what happens to a Child Workflow Execution if its Parent changes to a Closed status (Completed, Failed, or Timed Out).
    // WAIT_CANCELLATION_COMPLETED (default): When cancellation is requested for the child workflow, the parent workflow waits until the child workflow has completed its cancellation process (including any cleanup or compensation logic). The parent does not proceed until it receives confirmation that the child workflow has completely finished its cancellation.

    const paymentChildWorkflow = await startChild(paymentWorkflow, {
      args: [orderId],
      // workflowId, // add business-meaningful workflow id here
      // // regular workflow options apply here, with two additions (defaults shown):
      cancellationType:
        ChildWorkflowCancellationType.WAIT_CANCELLATION_COMPLETED,
      parentClosePolicy: ParentClosePolicy.PARENT_CLOSE_POLICY_TERMINATE,
    });

    // Step 3: Wait for payment completion or cancellation signal
    const paymentResult = await Promise.race([
      paymentChildWorkflow.result(),
      waitForCancellation(isCanceled),
    ]);

    if (isCanceled) {
      console.log(`Order for ID ${orderId} was canceled.`);
      return 'Order Canceled';
    }

    // Step 4: Proceed to shipping if payment is successful

    console.log(`Order for ID ${orderId} has been shipped.`);

    return 'Order Completed';
  } finally {
  }
}

/** Helper function to handle cancellation */
async function waitForCancellation(isCanceled: boolean): Promise<void> {
  while (!isCanceled) {
    await sleep(1000); // Check for cancellation every second
  }
}
