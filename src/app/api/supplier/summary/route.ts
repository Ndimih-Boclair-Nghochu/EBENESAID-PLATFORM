import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';

async function loadMenu(request: NextRequest) {
  const { GET } = await import('@/app/api/supplier/menu/route');
  return GET(request);
}

async function loadOrders(request: NextRequest) {
  const { GET } = await import('@/app/api/supplier/orders/route');
  return GET(request);
}

function requireSupplier(userType?: string) {
  return userType === 'supplier' || userType === 'admin' || userType === 'staff';
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !requireSupplier(user.userType)) {
    return NextResponse.json({ error: 'Supplier access required.' }, { status: 403 });
  }

  try {
    const [menuRes, ordersRes] = await Promise.all([loadMenu(request), loadOrders(request)]);
    const menuData = await menuRes.json();
    const ordersData = await ordersRes.json();

    if (!menuRes.ok) {
      return NextResponse.json({ error: menuData.error || 'Failed to load supplier data.' }, { status: menuRes.status });
    }
    if (!ordersRes.ok) {
      return NextResponse.json({ error: ordersData.error || 'Failed to load supplier data.' }, { status: ordersRes.status });
    }

    const items = menuData.items ?? [];
    const orders = ordersData.orders ?? [];
    const completedOrders = orders.filter((order: { status: string }) => order.status === 'Delivered').length;
    const activeOrders = orders.filter((order: { status: string }) => order.status !== 'Delivered' && order.status !== 'Cancelled').length;
    const totalRevenue = orders.reduce((sum: number, order: { total: number }) => sum + Number(order.total ?? 0), 0);

    return NextResponse.json(
      {
        items,
        orders,
        metrics: {
          menuItems: items.length,
          activeOrders,
          completedOrders,
          totalRevenue,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Supplier summary load error:', error);
    return NextResponse.json({ error: 'Failed to load supplier dashboard.' }, { status: 500 });
  }
}
