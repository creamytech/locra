// LOCRA Atlas Loyalty - Redeem Reward API  
import { NextRequest } from 'next/server';
import { handleRedeemReward } from '@/lib/loyalty/api';

export async function POST(request: NextRequest) {
  return handleRedeemReward(request);
}
