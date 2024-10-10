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
async function useCaseTwoWorkflow(orderId: string): Promise<string> {
  let isSignalReceived = false;

  setHandler(cancelSignal, () => {
    isSignalReceived = true;
    console.log('signal received from an api call', orderId);
  });

  try {
    // Step 1: Place the order
    console.log(`Order placed for ID: ${orderId}`);

    // Step 2: Start the payment workflow as a child workflow

    // A Parent Close Policy determines what happens to a Child Workflow Execution if its Parent changes to a Closed status (Completed, Failed, or Timed Out).
    // WAIT_CANCELLATION_COMPLETED (default): When cancellation is requested for the child workflow, the parent workflow waits until the child workflow has completed its cancellation process (including any cleanup or compensation logic). The parent does not proceed until it receives confirmation that the child workflow has completely finished its cancellation.
    const workflowId = 'workflow-usecase-two-child' + Math.random();

    console.log(
      '🎖️🎖️  ⚔️  file: use-case-two-parent-workflows.ts:39  ⚔️  useCaseTwoWorkflow  ⚔️  workflowId 🎖️🎖️',
      workflowId,
    );
// setting the parentClosePolicy to PARENT_CLOSE_POLICY_ABANDON makes the child workflow continue even if parent is closed, and setting the parent to PARENT_CLOSE_POLICY_TERMINATE cancels the child worflow execution by force and if want a graceful stop then use PARENT_CLOSE_POLICY_REQUEST_CANCEL
    const paymentChildWorkflow = await startChild(paymentWorkflow, {
      args: [orderId],
      // workflowId, // add business-meaningful workflow id here
      // // regular workflow options apply here, with two additions (defaults shown):
      cancellationType:
        ChildWorkflowCancellationType.WAIT_CANCELLATION_COMPLETED,
      parentClosePolicy: ParentClosePolicy.PARENT_CLOSE_POLICY_REQUEST_CANCEL,
    });

    // note that if parent workflow is cancelled then its child will also be cancelled irrespective of the below code snippets
    // Step 3: Wait for payment completion or cancellation signal
     await Promise.race([
       paymentChildWorkflow.result(),
       waitForCancellation(isSignalReceived),
     ]);

    if (isSignalReceived) {
      console.log(`signal received at parent workflow`);
      return 'signal received at parent workflow'
    }
    else{
      console.log(`child workflow completed before signal was received`);
      return "child workflow completed successfully";
    }


  } catch (error) {
    console.log(
      '🎖️🎖️  ⚔️  file: use-case-two-parent-workflows.ts:67  ⚔️  useCaseTwoWorkflow  ⚔️  error 🎖️🎖️',
      error,
    );
    throw error;
  }
}

/** Helper function to handle cancellation */
async function waitForCancellation(isSignalReceived: boolean): Promise<void> {
  while (!isSignalReceived) {
    await sleep(1000); // Check for cancellation every second
  }
}

export { useCaseTwoWorkflow, paymentWorkflow };
