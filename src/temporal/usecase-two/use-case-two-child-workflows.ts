import { sleep } from '@temporalio/workflow';

/** Payment Workflow */
export async function paymentWorkflow(orderId: string): Promise<string> {
  console.log(`Processing payment for order ID: ${orderId}`);

  // Simulate some delay for payment processing
  await sleep(5000); // 5 seconds delay

  console.log(`Payment for order ID: ${orderId} processed successfully.`);
  return 'Payment Successful';
}
