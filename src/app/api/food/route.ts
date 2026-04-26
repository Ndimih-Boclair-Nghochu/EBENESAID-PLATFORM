import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { sendPlatformAnnouncementEmail } from '@/lib/email';
import { getUserById } from '@/lib/db';
import { createFoodOrder, getFoodData } from '@/lib/student-account';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const data = await getFoodData(user);
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  try {
    const body = await request.json();
    const order = await createFoodOrder(user, {
      itemId: Number(body.itemId),
      fulfillment: String(body.fulfillment ?? ''),
    });
    const data = await getFoodData(user);

    void sendPlatformAnnouncementEmail({
      toEmail: user.email,
      firstName: user.firstName,
      subject: 'Your EBENESAID food order was received',
      title: 'Food order confirmed',
      intro: 'Your order has been recorded successfully and is now visible in your account.',
      body: [
        `Item: ${order.itemName}`,
        `Fulfillment: ${order.fulfillment || 'Not specified'}`,
        `Total: EUR ${order.total.toFixed(2)}`,
      ],
      action: {
        label: 'Open Food Orders',
        href: `${(process.env.NEXT_PUBLIC_APP_URL || 'https://ebenesaid.com').replace(/\/$/, '')}/food`,
      },
    });

    if (order.supplierUserId) {
      const supplier = await getUserById(order.supplierUserId);
      if (supplier?.email) {
        void sendPlatformAnnouncementEmail({
          toEmail: supplier.email,
          firstName: supplier.first_name,
          subject: 'New EBENESAID food order',
          title: 'A new food order is waiting',
          intro: 'A student placed a new food order through the platform.',
          body: [
            `Student: ${user.firstName} ${user.lastName}`.trim(),
            `Item: ${order.itemName}`,
            `Fulfillment: ${order.fulfillment || 'Not specified'}`,
          ],
          action: {
            label: 'Open Supplier Orders',
            href: `${(process.env.NEXT_PUBLIC_APP_URL || 'https://ebenesaid.com').replace(/\/$/, '')}/supplier/orders`,
          },
        });
      }
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Food order error:', error);
    return NextResponse.json({ error: 'Failed to create food order.' }, { status: 500 });
  }
}
