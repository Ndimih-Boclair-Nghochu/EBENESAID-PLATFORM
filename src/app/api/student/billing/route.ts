import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getPlatformPricingSettings } from '@/lib/db';
import { normalizePaymentProvider, startStudentPlatformPayment } from '@/lib/payments';
import { getStudentBillingProfile, updateStudentBillingProfile } from '@/lib/student-account';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  try {
    const billing = await getStudentBillingProfile(user);
    const pricing = await getPlatformPricingSettings();
    return NextResponse.json({ billing, pricing }, { status: 200 });
  } catch (error) {
    console.error('Billing load error:', error);
    return NextResponse.json({ error: 'Failed to load billing profile.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const billing = await updateStudentBillingProfile(user, {
      billingName: String(body.billingName ?? ''),
      billingEmail: String(body.billingEmail ?? ''),
      billingPhone: String(body.billingPhone ?? ''),
      billingCountry: String(body.billingCountry ?? ''),
      billingCurrency: String(body.billingCurrency ?? 'EUR'),
      billingAddress: String(body.billingAddress ?? ''),
      providerPreference: String(body.providerPreference ?? 'stripe') === 'flutterwave' ? 'flutterwave' : 'stripe',
      stripeCustomerEmail: String(body.stripeCustomerEmail ?? ''),
      stripeCustomerId: String(body.stripeCustomerId ?? ''),
      stripePaymentMethodLabel: String(body.stripePaymentMethodLabel ?? ''),
      stripeCheckoutMode: String(body.stripeCheckoutMode ?? 'card'),
      flutterwaveCustomerEmail: String(body.flutterwaveCustomerEmail ?? ''),
      flutterwaveCustomerId: String(body.flutterwaveCustomerId ?? ''),
      flutterwavePaymentMethod: String(body.flutterwavePaymentMethod ?? 'card'),
      flutterwaveMobileMoneyProvider: String(body.flutterwaveMobileMoneyProvider ?? ''),
      flutterwaveReference: String(body.flutterwaveReference ?? ''),
      invoiceEmail: String(body.invoiceEmail ?? ''),
      autoRenew: Boolean(body.autoRenew),
    });

    return NextResponse.json({ billing }, { status: 200 });
  } catch (error) {
    console.error('Billing update error:', error);
    return NextResponse.json({ error: 'Failed to update billing profile.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const provider = normalizePaymentProvider(body.providerPreference);
    const payment = await startStudentPlatformPayment(user, provider);

    return NextResponse.json(
      {
        payment,
        platformFee: payment.amount,
        message: payment.message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Billing payment error:', error);
    return NextResponse.json({ error: 'Failed to complete platform payment.' }, { status: 500 });
  }
}
