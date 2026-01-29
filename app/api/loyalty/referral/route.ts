// LOCRA Atlas Loyalty - Referral Claim API
import { NextRequest } from 'next/server';
import { handleClaimReferral } from '@/lib/loyalty/api';

export async function POST(request: NextRequest) {
  return handleClaimReferral(request);
}
