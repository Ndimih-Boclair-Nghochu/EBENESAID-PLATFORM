import { NextRequest, NextResponse } from 'next/server';

import { completePlatformPayment } from '@/lib/db';

type FlutterwavePayload = {
  event?: string;
  data?: {
    status?: string;
    meta?: {
      userId?: string | number;
    };
  };
};

export async function POST(request: NextRequest) {
  const expectedHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;
  if (!expectedHash) {
    return NextResponse.json({ error: 'Flutterwave webhook hash is not configured.' }, { status: 503 });
  }

  const signature = request.headers.get('verif-hash');
  if (signature !== expectedHash) {
    return NextResponse.json({ error: 'Invalid Flutterwave webhook signature.' }, { status: 401 });
  }

  const payload = await request.json() as FlutterwavePayload;
  const userId = Number(payload.data?.meta?.userId);

  if (payload.event !== 'charge.completed' || payload.data?.status !== 'successful') {
    return NextResponse.json({ received: true, ignored: true }, { status: 200 });
  }

  if (!Number.isInteger(userId) || userId <= 0) {
    return NextResponse.json({ error: 'Flutterwave payload missing valid user id.' }, { status: 400 });
  }

  const payment = await completePlatformPayment(userId, 'flutterwave');
  return NextResponse.json({ received: true, payment }, { status: 200 });
}
