/** Ship Order Activity */
export async function shipOrder(orderId: string): Promise<void> {
  console.log(`Shipping order with ID: ${orderId}`);
  // Simulate delay for shipping
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log(`Order with ID: ${orderId} shipped successfully.`);
}
