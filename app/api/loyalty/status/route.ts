// LOCRA Atlas Loyalty - Member Status API
import { NextRequest } from 'next/server';
import { handleGetMemberStatus } from '@/lib/loyalty/api';

export async function GET(request: NextRequest) {
  return handleGetMemberStatus(request);
}
