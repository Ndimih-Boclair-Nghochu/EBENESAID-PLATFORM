'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Utensils, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Activity, 
  DollarSign, 
  Tag, 
  Flame,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Truck,
  Camera,
  Image as ImageIcon
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const menuItems: { id: number; name: string; price: number; delivery: number; status: string; category: string; orders: number; img: string }[] = [];

export default function MenuManagerPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-orange-400/20 bg-orange-50 text-orange-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Inventory Node • Menu Protocol
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Supply Optimized
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Menu <span className="text-orange-600">Manager</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-widest">Maintain meal liquidity and culinary standards for the student cohort.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-orange-600/20 bg-orange-600 text-white border-none gap-2 text-[10px] w-full sm:w-auto transition-all hover:scale-105 active:scale-95">
                  <Plus className="h-3.5 w-3.5" /> Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white max-w-[600px] w-[95vw] max-h-[85vh] flex flex-col">
                {/* Fixed Header */}
                <div className="bg-orange-600 p-6 sm:p-8 text-white relative shrink-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                  <DialogHeader className="relative z-10 text-left">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
                      <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <DialogTitle className="text-xl sm:text-2xl font-black italic tracking-tight uppercase leading-none text-white">Initialize <span className="opacity-70">Menu Item</span></DialogTitle>
                    <DialogDescription className="text-orange-100 font-bold uppercase tracking-[0.2em] text-[8px] sm:text-[10px] mt-2">
                      New Inventory Node Protocol
                    </DialogDescription>
                  </DialogHeader>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Image Upload Area */}
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dish Imagery</Label>
                      <div className="relative group aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer overflow-hidden">
                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-slate-300 group-hover:text-orange-600 shadow-sm transition-colors">
                          <Camera className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Upload Dish Photo</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Supports JPG, PNG (Max 5MB)</p>
                        </div>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dish Name</Label>
                      <Input placeholder="e.g. Suya Chicken" className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price (€)</Label>
                        <Input type="number" placeholder="8.50" className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Delivery Fee</Label>
                        <Input type="number" placeholder="Optional" className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Prep Time</Label>
                        <Input type="number" placeholder="Mins" className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</Label>
                      <Input placeholder="e.g. West African" className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</Label>
                      <Textarea placeholder="Detail the ingredients and prep method..." className="min-h-[100px] rounded-2xl bg-slate-50 border-none font-bold text-xs p-4" />
                    </div>

                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                        <Activity className="h-4 w-4" />
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-orange-700/70 font-medium leading-relaxed uppercase tracking-wider">
                        Item will be instantly visible to the student cohort after certification.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 shrink-0">
                  <DialogFooter>
                    <Button className="w-full h-14 rounded-2xl bg-orange-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all">
                      Confirm & Certify Item
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
           <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
             <Input placeholder="Search dishes, categories or stock status..." className="h-10 pl-9 rounded-lg bg-slate-50 border-none focus:bg-white transition-all font-bold text-xs" />
           </div>
           <div className="flex gap-2">
             <Button variant="outline" className="h-10 rounded-lg font-black border-slate-200 gap-2 text-[10px] px-4">
               <Filter className="h-3.5 w-3.5" /> Categories
             </Button>
           </div>
        </div>

        {/* Menu Grid */}
        {menuItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Utensils className="h-10 w-10 text-slate-200 mb-4" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No menu items yet</p>
            <p className="text-[10px] text-slate-300 uppercase tracking-widest mt-1">Add your first dish using the button above.</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card key={item.id} className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="relative aspect-video overflow-hidden">
                <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-4 left-4">
                  <Badge className={`border-none font-black text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-lg shadow-lg ${item.status === 'Available' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {item.status}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex gap-2 w-full">
                    <Button variant="secondary" className="flex-1 h-9 rounded-xl font-black text-[9px] uppercase tracking-widest bg-white text-slate-900 border-none shadow-xl">
                      <Edit3 className="h-3.5 w-3.5 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" className="h-9 w-9 rounded-xl border-none shadow-xl">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <CardHeader className="p-6 pb-2">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 min-w-0">
                    <CardTitle className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors truncate">{item.name}</CardTitle>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      <Tag className="h-3 w-3 text-orange-600" /> {item.category}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-black text-orange-600 tracking-tighter leading-none italic">€{item.price.toFixed(2)}</p>
                    {item.delivery > 0 && (
                      <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        + €{item.delivery.toFixed(2)} delivery
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-6 py-4 space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-[8px] font-black text-slate-400 uppercase">Available</Label>
                    <Switch checked={item.status === 'Available'} className="data-[state=checked]:bg-emerald-500" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Total Sales</p>
                    <p className="text-xs font-black text-slate-700">{item.orders} Units</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Prep Time</p>
                    <p className="text-xs font-black text-slate-700">~18 Mins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SidebarShell>
  );
}
