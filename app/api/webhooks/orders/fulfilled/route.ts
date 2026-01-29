// LOCRA Atlas Loyalty - Order Fulfilled Webhook
import { NextRequest } from 'next/server';
import { handleOrderFulfilled } from '@/lib/loyalty/webhooks';

export async function POST(request: NextRequest) {
  return handleOrderFulfilled(request);
}
