/**
 * Loyalty Enrollment API Route
 * Auto-enrolls authenticated customers into the loyalty program
 */

import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/loyalty/db';

// Interface for enrollment request
interface EnrollmentRequest {
  shopifyCustomerId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  referralCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as EnrollmentRequest;
    
    // Validate required fields
    if (!body.shopifyCustomerId || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields: shopifyCustomerId and email' },
        { status: 400 }
      );
    }

    // Check if account already exists
    const existingAccount = await db.getAccountByShopifyId(body.shopifyCustomerId);
    
    if (existingAccount) {
      // Account exists, return it
      console.log('Enrollment: Account already exists for', body.shopifyCustomerId);
      return NextResponse.json({ 
        success: true, 
        enrolled: false, // Not newly enrolled
        account: existingAccount 
      });
    }

    // Check for referral code if provided
    let referredByAccountId: string | undefined;
    if (body.referralCode) {
      const referrerAccount = await db.getAccountByReferralCode(body.referralCode);
      if (referrerAccount) {
        referredByAccountId = referrerAccount.id;
        console.log('Enrollment: Referred by account', referrerAccount.id);
      }
    }

    // Create new account
    console.log('Enrollment: Creating new account for', body.shopifyCustomerId);
    const newAccount = await db.createAccount(
      body.shopifyCustomerId,
      body.email,
      referredByAccountId
    );

    // Update profile with first name if provided
    if (body.firstName || body.lastName) {
      await db.updateAccountProfile(newAccount.id, {
        firstName: body.firstName,
        lastName: body.lastName,
      });
    }

    // Award signup bonus miles
    await db.addMiles(
      newAccount.id,
      'earn_signup_bonus',
      100, // Welcome bonus
      'Welcome to the Travel Club! Here are your first miles.',
      {
        idempotencyKey: `signup-bonus-${newAccount.id}`,
        metadata: { source: 'auto_enrollment' },
      }
    );

    console.log('Enrollment: Successfully created account', newAccount.id);

    // Fetch the updated account with bonus miles
    const updatedAccount = await db.getAccountByShopifyId(body.shopifyCustomerId);

    return NextResponse.json({ 
      success: true, 
      enrolled: true, // Newly enrolled
      account: updatedAccount,
      welcomeBonus: 100,
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to enroll customer', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check enrollment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shopifyCustomerId = searchParams.get('shopifyCustomerId');

    if (!shopifyCustomerId) {
      return NextResponse.json(
        { error: 'Missing shopifyCustomerId parameter' },
        { status: 400 }
      );
    }

    const account = await db.getAccountByShopifyId(shopifyCustomerId);

    return NextResponse.json({
      enrolled: !!account,
      account: account || null,
    });

  } catch (error) {
    console.error('Enrollment check error:', error);
    return NextResponse.json(
      { error: 'Failed to check enrollment status' },
      { status: 500 }
    );
  }
}
