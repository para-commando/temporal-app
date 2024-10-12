// src/temporal/workflows.ts
import {
  defineSignal,
  sleep,
  startChild,
  setHandler,
} from '@temporalio/workflow';
import { usecaseThreeChild } from './use-case-three-child-workflows';
import { shipOrder } from './use-case-three.activities';

// export const incrementSignal = wf.defineSignal('increment');
// Define signals for cancellation
const cancelSignal =  defineSignal('cancel');
/** Main Order Processing Workflow */
async function useCaseThreeWorkflow(
  orderId: string,
  childWorkflowId: string,
  parentWorkflowId: string
): Promise<string> {
  let isSignalReceived = false;

   setHandler(cancelSignal, () => {
    isSignalReceived = true;
    console.log('Signal received from an API call');
  });

  try {
    // Step 1: Place the order
    console.log(`Entered use case three ${orderId}`);

    console.log(`Starting usecase 3 child workflow`);

    const usecaseThreeChildWorkflow = await startChild(usecaseThreeChild, {
      args: [orderId],
      workflowId: childWorkflowId, // Add a business-meaningful workflow ID here
    });
    await shipOrder(orderId, childWorkflowId, parentWorkflowId);
    await Promise.race([
      usecaseThreeChildWorkflow.result(),
      waitForCancellation(isSignalReceived),
    ]);

    if (isSignalReceived) {
      // await usecaseThreeChildWorkflow.signal(cancelChildThree);
      console.log(`Signal received at parent workflow`);

      return 'Signal received at parent workflow';
    } else {
      console.log(`Child workflow completed before signal was received`);
      return 'Child and parent workflow completed successfully';
    }
  } catch (error) {
    console.log(
      '🎖️🎖️  ⚔️  file: use-case-two-parent-workflows.ts:67  ⚔️  useCaseThreeWorkflow  ⚔️  error 🎖️🎖️',
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

// Export the workflow and child workflow
export { useCaseThreeWorkflow, usecaseThreeChild };
