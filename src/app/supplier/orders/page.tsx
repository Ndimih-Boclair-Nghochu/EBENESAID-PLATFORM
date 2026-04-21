'use client';

import { useEffect, useState } from 'react';

import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Order = {
  id: number;
  itemName: string;
  total: number;
  fulfillment: string;
  status: string;
  createdAt: string;
  studentName: string;
  phone: string;
  email: string;
};

export default function OrderLedgerPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  async function loadOrders() {
    const res = await fetch('/api/supplier/orders', { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load supplier orders.');
    }
    setOrders(data.orders ?? []);
  }

  useEffect(() => {
    loadOrders().catch(error => setStatus(error instanceof Error ? error.message : 'Failed to load supplier orders.'));
  }, []);

  async function updateStatus(orderId: number, nextStatus: string) {
    setSavingId(orderId);
    setStatus(null);
    try {
      const res = await fetch('/api/supplier/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update order status.');
      }
      setOrders(data.orders ?? []);
      setStatus(`Order #${orderId} updated to ${nextStatus}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to update order status.');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="border-b border-slate-100 pb-5">
          <Badge variant="outline" className="border-orange-200 bg-orange-50 text-[8px] font-black uppercase tracking-widest text-orange-600">
            Order Ledger
          </Badge>
          <h1 className="mt-3 text-xl font-black text-slate-900">Supplier Orders</h1>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Real student food orders loaded from the backend.
          </p>
        </div>

        {status ? <p className="text-sm text-slate-600">{status}</p> : null}

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black">Real Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orders.length ? (
              orders.map(order => (
                <div key={order.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-black text-slate-900">{order.itemName}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                        {order.studentName} | {order.fulfillment} | {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{order.status}</Badge>
                      <span className="font-black text-primary">EUR {order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      disabled={savingId === order.id}
                      onClick={() => updateStatus(order.id, 'Preparing')}
                    >
                      Preparing
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      disabled={savingId === order.id}
                      onClick={() => updateStatus(order.id, 'Out for Delivery')}
                    >
                      Dispatch
                    </Button>
                    <Button
                      className="rounded-xl bg-green-700 hover:bg-green-800"
                      disabled={savingId === order.id}
                      onClick={() => updateStatus(order.id, 'Delivered')}
                    >
                      Complete
                    </Button>
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
      </div>
    </SidebarShell>
  );
}
