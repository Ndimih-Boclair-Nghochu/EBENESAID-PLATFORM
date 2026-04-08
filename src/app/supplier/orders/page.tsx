
'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight,
  Activity,
  Phone,
  FileText,
  Navigation,
  Utensils,
  ShoppingBag
} from "lucide-react";
import { Input } from "@/components/ui/input";

const orderLedger = [
  { 
    id: "ord_102", 
    student: "Louis D.", 
    dish: "Jollof Rice x2", 
    total: "€17.00", 
    status: "Preparing", 
    time: "5m ago", 
    fulfillment: "Delivery",
    address: { street: "K. Valdemāra iela", bldg: "21", apt: "4B", city: "Riga" },
    phone: "+371 20 123 456" 
  },
  { 
    id: "ord_101", 
    student: "Maria K.", 
    dish: "Pelmeņi (L)", 
    total: "€6.50", 
    status: "Delivered", 
    time: "1h ago", 
    fulfillment: "Pickup",
    address: { street: "Kitchen Counter", bldg: "Locker A", apt: "", city: "Riga" },
    phone: "+371 20 987 654" 
  },
  { 
    id: "ord_100", 
    student: "Kofi M.", 
    dish: "Chicken Tikka", 
    total: "€9.00", 
    status: "Preparing", 
    time: "15m ago", 
    fulfillment: "Pickup",
    address: { street: "Lomonosova iela", bldg: "1", apt: "Dorm 302", city: "Riga" },
    phone: "+371 20 555 000" 
  },
  { 
    id: "ord_099", 
    student: "Ananya S.", 
    dish: "Vegetable Curry", 
    total: "€8.00", 
    status: "Cancelled", 
    time: "3h ago", 
    fulfillment: "Delivery",
    address: { street: "Stabu iela", bldg: "14", apt: "9", city: "Riga" },
    phone: "+371 20 111 222" 
  },
];

export default function OrderLedgerPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-orange-400/20 bg-orange-50 text-orange-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Supply Ledger • Node Active
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Data Stream: Live
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Order <span className="text-orange-600">Ledger</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-widest">Comprehensive operational history of meal fulfillment nodes.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto">
              <FileText className="h-3.5 w-3.5 text-orange-600" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
           <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
             <Input placeholder="Search orders by ID, student or address..." className="h-10 pl-9 rounded-lg bg-slate-50 border-none focus:bg-white transition-all font-bold text-xs" />
           </div>
           <Button variant="outline" className="h-10 rounded-lg font-black border-slate-200 gap-2 text-[10px] px-4">
             <Filter className="h-3.5 w-3.5" /> Global Filters
           </Button>
        </div>

        {/* Ledger Interface */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm mb-6 h-auto">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white font-black text-[10px] uppercase h-8 px-6">All Orders</TabsTrigger>
            <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white font-black text-[10px] uppercase h-8 px-6">Active Fulfillment</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white font-black text-[10px] uppercase h-8 px-6">Completed Nodes</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {orderLedger.map((ord) => (
              <OrderRow key={ord.id} order={ord} />
            ))}
          </TabsContent>
          <TabsContent value="active" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {orderLedger.filter(o => o.status === 'Preparing').map((ord) => (
              <OrderRow key={ord.id} order={ord} />
            ))}
          </TabsContent>
          <TabsContent value="completed" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {orderLedger.filter(o => o.status === 'Delivered').map((ord) => (
              <OrderRow key={ord.id} order={ord} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </SidebarShell>
  );
}

function OrderRow({ order }: any) {
  const getFulfillmentIcon = (type: string) => {
    if (type === 'Delivery') return <Navigation className="h-3 w-3" />;
    return <ShoppingBag className="h-3 w-3" />;
  };

  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all">
      <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={`border-none font-black text-[8px] uppercase tracking-widest ${
              order.status === 'Preparing' ? 'bg-orange-50 text-orange-600' : 
              order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 
              'bg-red-50 text-red-400'
            }`}>
              {order.status}
            </Badge>
            <Badge variant="outline" className="border-slate-100 text-[7px] font-black uppercase tracking-widest gap-1 py-0 h-5">
              {getFulfillmentIcon(order.fulfillment)} {order.fulfillment}
            </Badge>
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> {order.time}
            </span>
            <span className="text-[9px] font-black text-slate-400 uppercase ml-auto lg:ml-0">{order.id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <User className="h-3.5 w-3.5" />
                <p className="text-[9px] font-black uppercase tracking-widest">Customer</p>
              </div>
              <p className="text-sm font-black text-slate-900">{order.student}</p>
              <p className="text-[10px] font-bold text-slate-400">{order.phone}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <ClipboardList className="h-3.5 w-3.5" />
                <p className="text-[9px] font-black uppercase tracking-widest">Menu Node</p>
              </div>
              <p className="text-sm font-black text-slate-900 italic">{order.dish}</p>
              <p className="text-xs font-black text-orange-600">{order.total}</p>
            </div>
            <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-orange-600">
                <MapPin className="h-3.5 w-3.5" />
                <p className="text-[9px] font-black uppercase tracking-widest">Address / Coordinate</p>
              </div>
              <div className="mt-1">
                <p className="text-[11px] font-black text-slate-900 leading-tight">{order.address.street} {order.address.bldg}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  {order.address.apt ? `Apt: ${order.address.apt}` : 'Counter'} • {order.address.city}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col gap-2 shrink-0 lg:w-48 lg:border-l lg:border-slate-50 lg:pl-6">
          {order.status === 'Preparing' ? (
            <Button className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20">
              Dispatch
            </Button>
          ) : (
            <Button variant="outline" className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-100">
              Details
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-10 w-10 lg:w-full rounded-xl text-slate-300 hover:text-orange-600">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
