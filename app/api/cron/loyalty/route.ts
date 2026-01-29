// LOCRA Atlas Loyalty - Daily Cron Jobs
// Configure in Vercel: Settings > Cron Jobs
// Schedule: 0 0 * * * (daily at midnight)

import { NextResponse } from 'next/server';
import { handleProcessReferrals, handleExpireMiles } from '@/lib/loyalty/webhooks';

export async function GET() {
  try {
    // Process referral credits past buffer period
    await handleProcessReferrals();
    
    // Mark expired miles
    await handleExpireMiles();
    
    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}

// Vercel Cron configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
