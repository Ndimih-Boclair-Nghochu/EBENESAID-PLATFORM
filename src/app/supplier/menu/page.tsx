'use client';

import { useEffect, useState } from 'react';
import { Plus, Utensils } from 'lucide-react';

import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type MenuItem = {
  id: number;
  name: string;
  price: number;
  deliveryFee: number;
  kitchen: string;
  prepTime: string;
  imageUrl: string;
  tags: string[];
};

const initialForm = {
  name: '',
  price: '',
  deliveryFee: '',
  prepTime: '',
  imageUrl: '',
  tags: '',
};

export default function MenuManagerPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  async function loadItems() {
    const res = await fetch('/api/supplier/menu', { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load menu items.');
    }
    setItems(data.items ?? []);
  }

  useEffect(() => {
    loadItems().catch(error => setStatus(error instanceof Error ? error.message : 'Failed to load menu items.'));
  }, []);

  async function handleCreateItem() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/supplier/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          deliveryFee: Number(form.deliveryFee || 0),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create menu item.');
      }
      setItems(data.items ?? []);
      setForm(initialForm);
      setStatus('Menu item created successfully.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to create menu item.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="border-b border-slate-100 pb-5">
          <Badge variant="outline" className="border-orange-200 bg-orange-50 text-[8px] font-black uppercase tracking-widest text-orange-600">
            Menu Manager
          </Badge>
          <h1 className="mt-3 text-xl font-black text-slate-900">Supplier Menu</h1>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Create real menu items stored in the backend. No static dish cards remain here.
          </p>
        </div>

        {status ? <p className="text-sm text-slate-600">{status}</p> : null}

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-base font-black">Add Menu Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input value={form.name} onChange={e => setForm(current => ({ ...current, name: e.target.value }))} placeholder="Dish name" />
              <Input value={form.price} onChange={e => setForm(current => ({ ...current, price: e.target.value }))} placeholder="Price" type="number" />
              <Input value={form.deliveryFee} onChange={e => setForm(current => ({ ...current, deliveryFee: e.target.value }))} placeholder="Delivery fee" type="number" />
              <Input value={form.prepTime} onChange={e => setForm(current => ({ ...current, prepTime: e.target.value }))} placeholder="Prep time" />
              <Input value={form.imageUrl} onChange={e => setForm(current => ({ ...current, imageUrl: e.target.value }))} placeholder="Image URL (optional)" />
              <Input value={form.tags} onChange={e => setForm(current => ({ ...current, tags: e.target.value }))} placeholder="Tags separated by commas" />
              <Button onClick={handleCreateItem} disabled={saving} className="w-full rounded-xl bg-orange-600 hover:bg-orange-700">
                <Plus className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Create Item'}
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-8">
            <CardHeader>
              <CardTitle className="text-base font-black">Real Menu Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.length ? (
                items.map(item => (
                  <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                        <Utensils className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{item.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                          {item.kitchen} | {item.prepTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{item.tags.join(', ') || 'No tags'}</Badge>
                      <span className="font-black text-primary">EUR {item.price.toFixed(2)}</span>
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
        </div>
      </div>
    </SidebarShell>
  );
}
