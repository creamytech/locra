// LOCRA Atlas Loyalty - Earn Miles API
import { NextRequest } from 'next/server';
import { handleEarnMiles } from '@/lib/loyalty/api';

export async function POST(request: NextRequest) {
  return handleEarnMiles(request);
}
