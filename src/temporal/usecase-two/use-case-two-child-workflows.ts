import { sleep } from '@temporalio/workflow';

/** Payment Workflow */
export async function paymentWorkflow(orderId: string): Promise<string> {
  console.log(`Processing payment for order ID: ${orderId}`);

  // Simulate some delay for payment processing
  await sleep(20000),
    console.log(`Payment for order ID: ${orderId} processed successfully.`);
  return 'Payment Successful';
}
/** Helper function to handle cancellation */
