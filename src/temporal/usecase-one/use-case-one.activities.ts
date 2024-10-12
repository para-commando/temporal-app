// src/temporal/activities.ts
export async function placeOrder(orderId: string) {
  console.log(`Order placed: ${orderId}`);
}
export async function shipOrder(orderId: string) {
  console.log(`Order shipped: ${orderId}`);
}
export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}