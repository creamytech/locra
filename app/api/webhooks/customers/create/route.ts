// LOCRA Atlas Loyalty - Customer Create Webhook
import { NextRequest } from 'next/server';
import { handleCustomerCreate } from '@/lib/loyalty/webhooks';

export async function POST(request: NextRequest) {
  return handleCustomerCreate(request);
}
