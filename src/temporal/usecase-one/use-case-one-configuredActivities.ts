// src/temporal/activityConfig.ts
import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './use-case-one.activities';
 
const retryOptions = {
  initialInterval: 1000, // milliseconds
  maximumInterval: 60000, // milliseconds
  maximumAttempts: 5,
  backoffCoefficient: 2,
};

export const activityOptions = {
  startToCloseTimeout: 60000, // milliseconds
  retry: retryOptions,
};

// Export proxyActivities with retry options
export const { greet, shipOrder, placeOrder } =
  proxyActivities<typeof activities>(activityOptions);