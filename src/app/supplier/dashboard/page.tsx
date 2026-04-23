'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Utensils } from 'lucide-react';

import { discussKitchen } from '@/ai/flows/kitchen-specialist-flow';
import { SpecialistChat } from '@/components/SpecialistChat';
import { PageHeader } from '@/components/layout/page-header';
import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SupplierItem = {
  id: number;
  name: string;
  kitchen: string;
  price: number;
  prepTime: string;
};

type SupplierOrder = {
  id: number;
  itemName: string;
  total: number;
  status: string;
  fulfillment: string;
  studentName: string;
};

type SupplierSummary = {
  items: SupplierItem[];
  orders: SupplierOrder[];
  metrics: {
    menuItems: number;
    activeOrders: number;
    completedOrders: number;
    totalRevenue: number;
  };
  partnerProfile: { businessName: string; contactPerson: string; commissionPercent: number | null } | null;
  finance: { grossAmountEur: number; deductionAmountEur: number; netAmountEur: number };
  commissionPercent: number;
};

export default function SupplierDashboardPage() {
  const [data, setData] = useState<SupplierSummary | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/supplier/summary', { credentials: 'include' })
      .then(async res => {
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Failed to load supplier dashboard.');
        setData(payload);
      })
      .catch(error => setStatus(error instanceof Error ? error.message : 'Failed to load supplier dashboard.'));
  }, []);

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <PageHeader
          title="Kitchen Dashboard"
          subtitle="Real menu items and food orders"
          actions={
            <>
              <Button variant="outline" size="sm" className="rounded-xl" asChild>
                <Link href="/supplier/menu">Menu</Link>
              </Button>
              <Button size="sm" className="rounded-xl bg-orange-600 hover:bg-orange-700" asChild>
                <Link href="/supplier/orders">Orders</Link>
              </Button>
            </>
          }
        />

        {status ? <p className="text-sm text-slate-600">{status}</p> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Menu Items" value={data?.metrics.menuItems ?? 0} />
          <MetricCard label="Active Orders" value={data?.metrics.activeOrders ?? 0} />
          <MetricCard label="Completed Orders" value={data?.metrics.completedOrders ?? 0} />
          <MetricCard label="Revenue" value={`EUR ${(data?.metrics.totalRevenue ?? 0).toFixed(2)}`} />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-black">Latest Real Orders</CardTitle>
              <Button variant="outline" className="rounded-xl" asChild>
                <Link href="/supplier/orders">Open Orders</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.orders?.length ? (
                data.orders.slice(0, 6).map(order => (
                  <div key={order.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-black text-slate-900">{order.itemName}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                        {order.studentName} | {order.fulfillment}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{order.status}</Badge>
                      <span className="font-black text-primary">EUR {order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                  No real food orders exist yet.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6 lg:col-span-5">
            <SpecialistChat
              title="Kitchen Specialist"
              specialty="Menu & Operations"
              initialMessage="I can help you work with the real menu and order data currently loaded from the backend."
              flow={discussKitchen}
              icon={<Utensils className="h-4 w-4" />}
            />
            <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-black">Menu Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.items?.length ? (
                  data.items.slice(0, 4).map(item => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                      <div>
                        <p className="font-black text-slate-900">{item.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{item.kitchen}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary">EUR {item.price.toFixed(2)}</p>
                        <p className="mt-1 text-xs text-slate-400">{item.prepTime}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                    No real menu items exist yet.
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-black">Business Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p className="font-black text-slate-900">{data?.partnerProfile?.businessName || 'Food supplier account'}</p>
                <p>Contact: {data?.partnerProfile?.contactPerson || 'Not set yet'}</p>
                <p>Commission deduction: {Number(data?.commissionPercent ?? 0).toFixed(2)}%</p>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-black text-slate-900">EUR {Number(data?.finance.grossAmountEur ?? 0).toFixed(0)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">Gross</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900">EUR {Number(data?.finance.deductionAmountEur ?? 0).toFixed(0)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">Deduction</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-green-700">EUR {Number(data?.finance.netAmountEur ?? 0).toFixed(0)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">Net</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="rounded-[1.5rem] border-slate-100 bg-white shadow-sm">
      <CardContent className="p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );
}
