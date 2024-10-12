import { defineSignal, setHandler, sleep } from '@temporalio/workflow';

// Define the signal in the child workflow
const cancelChildThree = defineSignal('cancelChildThree');

export async function usecaseThreeChild(orderId: string): Promise<void> {
  let isCancelled = false;
 console.log("entered child workflow of usecase 3")
  // Handle the signal in the child workflow
  setHandler(cancelChildThree, () => {
    isCancelled = true;
    console.log('Child 3 workflow received cancellation signal');
  });

  try {
    // Simulate some work (e.g., processing the order)
    for (let i = 0; i < 30; i++) {
      if (isCancelled) {
        console.log('Child 3 workflow is cancelling');
        break;
      }
      console.log(`Processing input ${orderId}, step ${i}`);
      await sleep(1000);
    }

    if (!isCancelled) {
      console.log(`Child 3 workflow completed for order ${orderId}`);
    }
  } catch (error) {
    console.error('Error in child 3 workflow:', error);
    throw error;
  }
}

