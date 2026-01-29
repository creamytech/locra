// LOCRA Atlas Loyalty - Order Refunded Webhook
import { NextRequest } from 'next/server';
import { handleOrderRefunded } from '@/lib/loyalty/webhooks';

export async function POST(request: NextRequest) {
  return handleOrderRefunded(request);
}
