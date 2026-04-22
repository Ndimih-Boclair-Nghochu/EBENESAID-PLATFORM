import type { SafeUser } from '@/lib/db';
import { completePlatformPayment, getPlatformPricingSettings } from '@/lib/db';

export type PaymentProvider = 'stripe' | 'flutterwave';

export type PaymentMode = 'test' | 'live';

export type StudentPaymentResult = {
  provider: PaymentProvider;
  mode: PaymentMode;
  amount: number;
  currency: 'EUR';
  reference: string;
  status: 'completed' | 'requires_redirect';
  checkoutUrl: string | null;
  message: string;
};

export function normalizePaymentProvider(value: unknown): PaymentProvider {
  return String(value ?? 'stripe') === 'flutterwave' ? 'flutterwave' : 'stripe';
}

export function getPaymentProviderMode(provider: PaymentProvider): PaymentMode {
  if (provider === 'stripe') {
    return process.env.STRIPE_SECRET_KEY ? 'live' : 'test';
  }

  return process.env.FLUTTERWAVE_SECRET_KEY ? 'live' : 'test';
}

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
}

export async function startStudentPlatformPayment(
  user: SafeUser,
  provider: PaymentProvider
): Promise<StudentPaymentResult> {
  const pricing = await getPlatformPricingSettings();
  const mode = getPaymentProviderMode(provider);

  if (mode === 'test') {
    const payment = await completePlatformPayment(user.id, provider);
    return {
      provider,
      mode,
      amount: payment.amount,
      currency: 'EUR',
      reference: payment.reference,
      status: 'completed',
      checkoutUrl: null,
      message: `Test-mode platform fee recorded with ${provider === 'stripe' ? 'Stripe' : 'Flutterwave'}. Add live gateway keys to enable hosted checkout.`,
    };
  }

  const reference = `EB-${provider.toUpperCase()}-${user.id}-${Date.now()}`;
  const checkoutUrl =
    provider === 'stripe'
      ? await createStripeCheckoutUrl(user, pricing.studentFeeEur, reference)
      : await createFlutterwaveCheckoutUrl(user, pricing.studentFeeEur, reference);

  return {
    provider,
    mode,
    amount: pricing.studentFeeEur,
    currency: 'EUR',
    reference,
    status: 'requires_redirect',
    checkoutUrl,
    message: `Continue to ${provider === 'stripe' ? 'Stripe' : 'Flutterwave'} to complete your platform fee payment.`,
  };
}

async function createStripeCheckoutUrl(user: SafeUser, amount: number, reference: string): Promise<string> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error('Stripe is not configured.');
  }

  const appUrl = getAppUrl();
  const body = new URLSearchParams({
    mode: 'payment',
    success_url: `${appUrl}/billing?payment=success&reference=${encodeURIComponent(reference)}`,
    cancel_url: `${appUrl}/billing?payment=cancelled&reference=${encodeURIComponent(reference)}`,
    customer_email: user.email,
    'line_items[0][price_data][currency]': 'eur',
    'line_items[0][price_data][product_data][name]': 'EBENESAID student platform fee',
    'line_items[0][price_data][unit_amount]': String(Math.round(amount * 100)),
    'line_items[0][quantity]': '1',
    'metadata[userId]': String(user.id),
    'metadata[reference]': reference,
    client_reference_id: reference,
  });

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = await response.json() as { url?: string; error?: { message?: string } };
  if (!response.ok || !data.url) {
    throw new Error(data.error?.message || 'Stripe checkout session could not be created.');
  }

  return data.url;
}

async function createFlutterwaveCheckoutUrl(user: SafeUser, amount: number, reference: string): Promise<string> {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secret) {
    throw new Error('Flutterwave is not configured.');
  }

  const appUrl = getAppUrl();
  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref: reference,
      amount,
      currency: 'EUR',
      redirect_url: `${appUrl}/billing?payment=callback&reference=${encodeURIComponent(reference)}`,
      customer: {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        phonenumber: user.phone,
      },
      customizations: {
        title: 'EBENESAID platform fee',
        description: 'Student relocation platform access',
      },
      meta: {
        userId: user.id,
        reference,
      },
    }),
  });

  const data = await response.json() as { data?: { link?: string }; message?: string };
  if (!response.ok || !data.data?.link) {
    throw new Error(data.message || 'Flutterwave payment link could not be created.');
  }

  return data.data.link;
}
