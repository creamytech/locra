// LOCRA Atlas Loyalty - Order Paid Webhook
import { NextRequest } from 'next/server';
import { handleOrderPaid } from '@/lib/loyalty/webhooks';

export async function POST(request: NextRequest) {
  return handleOrderPaid(request);
}
