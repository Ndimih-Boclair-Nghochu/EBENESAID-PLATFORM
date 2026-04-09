'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, MessageSquare, ShoppingBag, Utensils } from "lucide-react";

import { discussKitchen } from "@/ai/flows/kitchen-specialist-flow";
import { SpecialistChat } from "@/components/SpecialistChat";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FoodItem = {
  id: number;
  name: string;
  price: number;
  deliveryFee: number;
  kitchen: string;
  time: string;
  rating: number;
  img: string;
  tags: string[];
};

type FoodOrder = {
  id: number;
  itemName: string;
  total: number;
  fulfillment: string;
  status: string;
  createdAt: string;
};

export default function FoodMarketplacePage() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function loadFood() {
    const res = await fetch("/api/food", { credentials: "include" });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to load food data.");
    }
    setItems(data.items ?? []);
    setOrders(data.orders ?? []);
  }

  useEffect(() => {
    loadFood().catch(error => setStatus(error.message));
  }, []);

  async function createOrder(item: FoodItem, fulfillment: "Delivery" | "Pickup") {
    const total = item.price + (fulfillment === "Delivery" ? item.deliveryFee : 0);
    const res = await fetch("/api/food", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        itemName: item.name,
        total,
        fulfillment,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Failed to create order.");
      return;
    }
    setItems(data.items ?? []);
    setOrders(data.orders ?? []);
    setStatus(`${item.name} order initialized for ${fulfillment.toLowerCase()}.`);
  }

  const filteredItems = useMemo(
    () => items.filter(item => `${item.name} ${item.kitchen} ${item.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
              Supply Node - Verified Delivery
            </Badge>
            <h1 className="text-xl font-black text-slate-900">Food Supply</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Order from real menu records and keep your own order history in one place.
            </p>
          </div>
          <Button variant="outline" className="rounded-xl" asChild>
            <Link href="#my-orders">My Orders</Link>
          </Button>
        </div>

        {status && <p className="text-sm font-medium text-slate-600">{status}</p>}

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SpecialistChat
              title="Kitchen Specialist"
              specialty="Dietary & Logistics Expert"
              initialMessage="Ask me about meal options, cultural foods in Riga, or which delivery flow fits your schedule."
              flow={discussKitchen}
              icon={<Utensils className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="rounded-[1.5rem] border-none bg-slate-900 p-6 text-white shadow-xl">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">Delivery Network</p>
              <p className="mt-4 text-3xl font-black">{items.length}</p>
              <p className="mt-2 text-sm text-slate-300">Live menu items ready for order.</p>
            </Card>
          </div>
        </div>

        <div className="relative">
          <Input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search cuisines, kitchens, or dishes..."
            className="h-11 rounded-xl bg-slate-50"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map(item => (
            <Card key={item.id} className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <CardTitle className="text-base font-black text-slate-900">{item.name}</CardTitle>
                    <p className="mt-2 text-xs uppercase tracking-wider text-slate-400">{item.kitchen}</p>
                  </div>
                  <Badge>{item.time}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                </div>
                <div className="text-sm text-slate-600">
                  Rating {item.rating.toFixed(1)} | Delivery fee EUR {item.deliveryFee.toFixed(2)}
                </div>
                <p className="text-lg font-black text-primary">EUR {item.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl" onClick={() => createOrder(item, "Pickup")}>
                    <ShoppingBag className="mr-2 h-4 w-4" /> Pickup
                  </Button>
                  <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={() => createOrder(item, "Delivery")}>
                    <MapPin className="mr-2 h-4 w-4" /> Delivery
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-xl" asChild>
                    <Link href="/messages"><MessageSquare className="h-4 w-4" /></Link>
                  </Button>
                  <Button variant="outline" className="rounded-xl" asChild>
                    <Link href="/settings">Delivery Settings</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!filteredItems.length && (
            <Card className="rounded-[2rem] border border-dashed border-slate-200 bg-white shadow-sm md:col-span-2 xl:col-span-3">
              <CardContent className="p-8 text-center text-sm text-slate-500">
                No real food items are available yet.
              </CardContent>
            </Card>
          )}
        </div>

        <Card id="my-orders" className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black">My Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orders.length > 0 ? orders.map(order => (
              <div key={order.id} className="flex flex-col gap-2 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-black text-slate-900">{order.itemName}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                    {order.fulfillment} | {order.createdAt}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge>{order.status}</Badge>
                  <p className="font-black text-primary">EUR {order.total.toFixed(2)}</p>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                No food orders yet for this account.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarShell>
  );
}
