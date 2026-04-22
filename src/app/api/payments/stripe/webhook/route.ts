import { NextRequest, NextResponse } from 'next/server';

import { completePlatformPayment } from '@/lib/db';

type StripeCheckoutPayload = {
  type?: string;
  data?: {
    object?: {
      metadata?: {
        userId?: string;
      };
      payment_status?: string;
    };
  };
};

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe webhook secret is not configured.' }, { status: 503 });
  }

  const payload = await request.json() as StripeCheckoutPayload;
  const checkout = payload.data?.object;
  const userId = Number(checkout?.metadata?.userId);

  if (payload.type !== 'checkout.session.completed' || checkout?.payment_status !== 'paid') {
    return NextResponse.json({ received: true, ignored: true }, { status: 200 });
  }

  if (!Number.isInteger(userId) || userId <= 0) {
    return NextResponse.json({ error: 'Stripe payload missing valid user id.' }, { status: 400 });
  }

  const payment = await completePlatformPayment(userId, 'stripe');
  return NextResponse.json({ received: true, payment }, { status: 200 });
}
