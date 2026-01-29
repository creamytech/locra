// @ts-nocheck
// LOCRA Atlas Loyalty System - Shopify Webhook Handlers
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import * as db from './db';
import { earnMilesFromPurchase } from './api';
import type { ShopifyOrderWebhook } from './types';

// =====================================================
// WEBHOOK VERIFICATION
// =====================================================

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '';

export function verifyShopifyWebhook(req: NextRequest, body: string): boolean {
  const hmacHeader = req.headers.get('x-shopify-hmac-sha256');
  if (!hmacHeader || !SHOPIFY_WEBHOOK_SECRET) return false;

  const generatedHash = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('base64');

  return crypto.timingSafeEquals(
    Buffer.from(hmacHeader),
    Buffer.from(generatedHash)
  );
}

// =====================================================
// WEBHOOK: ORDER PAID
// Triggered when an order payment is captured
// =====================================================

export async function handleOrderPaid(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  
  // Verify webhook signature
  if (!verifyShopifyWebhook(req, body)) {
    console.error('Invalid webhook signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const order: ShopifyOrderWebhook = JSON.parse(body);
  const webhookId = req.headers.get('x-shopify-webhook-id') || `order-paid-${order.id}`;

  // Check idempotency
  if (await db.isWebhookProcessed(webhookId)) {
    return NextResponse.json({ message: 'Already processed' });
  }

  // Record webhook
  await db.recordWebhook(
    webhookId,
    'orders/paid',
    order,
    String(order.id),
    String(order.customer?.id)
  );

  try {
    // Get or create loyalty account
    let account = await db.getAccountByShopifyId(String(order.customer.id));
    if (!account) {
      account = await db.createAccount(
        String(order.customer.id),
        order.customer.email
      );
    }

    // Extract destination handles from line items
    // Products should have a metafield or vendor indicating destination
    const destinationHandles = extractDestinationsFromOrder(order);

    // Earn miles
    await earnMilesFromPurchase({
      shopifyCustomerId: String(order.customer.id),
      shopifyOrderId: String(order.id),
      shopifyOrderName: order.name,
      orderTotalCents: Math.round(parseFloat(order.total_price) * 100),
      destinationHandles,
      idempotencyKey: `order-paid-${order.id}`,
    });

    // Check if this is a referred customer
    if (account.referredByAccountId) {
      await db.updateReferralOrderPlaced(
        account.id,
        String(order.id),
        Math.round(parseFloat(order.total_price) * 100)
      );
    }

    await db.markWebhookProcessed(webhookId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await db.markWebhookProcessed(webhookId, errorMessage);
    console.error('Order paid webhook error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

// =====================================================
// WEBHOOK: ORDER FULFILLED
// Triggered when an order is marked as fulfilled
// =====================================================

export async function handleOrderFulfilled(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  
  if (!verifyShopifyWebhook(req, body)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const order: ShopifyOrderWebhook = JSON.parse(body);
  const webhookId = req.headers.get('x-shopify-webhook-id') || `order-fulfilled-${order.id}`;

  if (await db.isWebhookProcessed(webhookId)) {
    return NextResponse.json({ message: 'Already processed' });
  }

  await db.recordWebhook(
    webhookId,
    'orders/fulfilled',
    order,
    String(order.id),
    String(order.customer?.id)
  );

  try {
    // Update referral status for referred customers
    await db.updateReferralFulfilled(String(order.id));

    await db.markWebhookProcessed(webhookId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await db.markWebhookProcessed(webhookId, errorMessage);
    console.error('Order fulfilled webhook error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

// =====================================================
// WEBHOOK: ORDER REFUNDED
// Triggered when an order is refunded
// =====================================================

export async function handleOrderRefunded(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  
  if (!verifyShopifyWebhook(req, body)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const order: ShopifyOrderWebhook = JSON.parse(body);
  const webhookId = req.headers.get('x-shopify-webhook-id') || `order-refunded-${order.id}`;

  if (await db.isWebhookProcessed(webhookId)) {
    return NextResponse.json({ message: 'Already processed' });
  }

  await db.recordWebhook(
    webhookId,
    'refunds/create',
    order,
    String(order.id),
    String(order.customer?.id)
  );

  try {
    const account = await db.getAccountByShopifyId(String(order.customer.id));
    if (!account) {
      await db.markWebhookProcessed(webhookId);
      return NextResponse.json({ success: true });
    }

    // Calculate refund amount and clawback miles
    const refundedCents = Math.round(parseFloat(order.total_price) * 100);
    const baseMiles = Math.floor(refundedCents / 100);

    // Clawback miles (negative transaction)
    await db.addMiles(
      account.id,
      'refund_clawback',
      -baseMiles,
      `Refund clawback: Order ${order.name}`,
      {
        idempotencyKey: `refund-${order.id}`,
        shopifyOrderId: String(order.id),
        shopifyOrderName: order.name,
      }
    );

    // Note: Stamps are NOT removed on refund (they're a badge of participation)

    await db.markWebhookProcessed(webhookId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await db.markWebhookProcessed(webhookId, errorMessage);
    console.error('Order refunded webhook error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

// =====================================================
// WEBHOOK: CUSTOMER CREATE
// Triggered when a new customer is created
// =====================================================

export async function handleCustomerCreate(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  
  if (!verifyShopifyWebhook(req, body)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  interface ShopifyCustomer {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  }
  
  const customer: ShopifyCustomer = JSON.parse(body);
  const webhookId = req.headers.get('x-shopify-webhook-id') || `customer-create-${customer.id}`;

  if (await db.isWebhookProcessed(webhookId)) {
    return NextResponse.json({ message: 'Already processed' });
  }

  await db.recordWebhook(
    webhookId,
    'customers/create',
    customer,
    undefined,
    String(customer.id)
  );

  try {
    // Create loyalty account if doesn't exist
    const existing = await db.getAccountByShopifyId(String(customer.id));
    if (!existing) {
      await db.createAccount(String(customer.id), customer.email);
    }

    await db.markWebhookProcessed(webhookId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await db.markWebhookProcessed(webhookId, errorMessage);
    console.error('Customer create webhook error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

// =====================================================
// HELPER: Extract Destinations from Order
// =====================================================

function extractDestinationsFromOrder(order: ShopifyOrderWebhook): string[] {
  const destinations = new Set<string>();

  for (const item of order.line_items) {
    // Check vendor field (e.g., "Santorini Collection")
    if (item.vendor) {
      const vendorLower = item.vendor.toLowerCase();
      if (vendorLower.includes('santorini')) destinations.add('santorini');
      if (vendorLower.includes('amalfi')) destinations.add('amalfi');
      if (vendorLower.includes('kyoto')) destinations.add('kyoto');
      if (vendorLower.includes('marrakech')) destinations.add('marrakech');
    }

    // Check product properties for destination tag
    for (const prop of item.properties || []) {
      if (prop.name === '_destination' && prop.value) {
        destinations.add(prop.value.toLowerCase());
      }
    }
  }

  return Array.from(destinations);
}

// =====================================================
// CRON: Process Referral Credits
// Run daily to credit referrals past buffer period
// =====================================================

export async function handleProcessReferrals(): Promise<NextResponse> {
  try {
    await db.processReferralCredits();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Process referrals error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

// =====================================================
// CRON: Expire Miles
// Run daily to mark expired miles
// =====================================================

export async function handleExpireMiles(): Promise<NextResponse> {
  // This would be implemented with a database query to mark expired miles
  // For now, just return success
  return NextResponse.json({ success: true });
}
