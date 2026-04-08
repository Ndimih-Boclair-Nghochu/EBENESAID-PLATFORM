
'use client';

import { useState } from "react";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Home, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Activity, 
  DollarSign, 
  MapPin, 
  ShieldCheck,
  ArrowUpRight,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  X,
  PlusCircle
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const listings = [
  { id: 1, title: "Premium Center Studio", price: 380, location: "K. Valdemāra iela, Riga", status: "Verified", type: "Studio", leads: 12, img: "https://picsum.photos/seed/apt1/400/300" },
  { id: 2, title: "International Student Flat", price: 270, location: "Zunda krastmala, Riga", status: "Verified", type: "Shared Room", leads: 8, img: "https://picsum.photos/seed/apt2/400/300" },
  { id: 3, title: "Modern Old Town Apt", price: 450, location: "Kaļķu iela, Riga", status: "Pending", type: "Whole Apartment", leads: 4, img: "https://picsum.photos/seed/apt3/400/300" },
];

export default function ListingManagerPage() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-400/20 bg-green-50 text-green-700 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Inventory Node • Property Registry
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Listings Synchronized
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Inventory <span className="text-green-700">Manager</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-widest">Maintain housing liquidity and verification standards for the student cohort.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-green-700/20 bg-green-700 text-white border-none gap-2 text-[10px] w-full sm:w-auto transition-all hover:scale-105 active:scale-95">
                  <Plus className="h-3.5 w-3.5" /> Add New Unit
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white max-w-[600px] w-[95vw] max-h-[85vh] flex flex-col">
                {/* Fixed Header */}
                <div className="bg-green-700 p-6 sm:p-8 text-white relative shrink-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                  <DialogHeader className="relative z-10 text-left">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
                      <Home className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <DialogTitle className="text-xl sm:text-2xl font-black italic tracking-tight uppercase leading-none text-white">Initialize <span className="opacity-70">Listing</span></DialogTitle>
                    <DialogDescription className="text-green-100 font-bold uppercase tracking-[0.2em] text-[8px] sm:text-[10px] mt-2">
                      New Housing Node Protocol
                    </DialogDescription>
                  </DialogHeader>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Multi-Image Upload Area */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Property Gallery</Label>
                        <span className="text-[8px] font-black text-primary uppercase bg-primary/5 px-2 py-0.5 rounded-full">{selectedImages.length} Assets Loaded</span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {/* Upload Trigger */}
                        <div className="relative group aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200 transition-all cursor-pointer overflow-hidden">
                          <PlusCircle className="h-6 w-6 text-slate-300 group-hover:text-green-700 transition-colors" />
                          <p className="text-[8px] font-black text-slate-400 uppercase text-center px-2">Add Photos</p>
                          <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            accept="image/*" 
                            multiple 
                            onChange={handleImageChange}
                          />
                        </div>

                        {/* Image Previews */}
                        {selectedImages.map((src, index) => (
                          <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm group">
                            <img src={src} alt={`Preview ${index}`} className="object-cover w-full h-full" />
                            <button 
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 h-5 w-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Listing Title</Label>
                      <Input placeholder="e.g. Modern Center Studio" className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Monthly Price (€)</Label>
                        <Input type="number" placeholder="350" className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Unit Type</Label>
                        <Select>
                          <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-2xl">
                            <SelectItem value="studio" className="font-bold text-xs">Studio</SelectItem>
                            <SelectItem value="shared" className="font-bold text-xs">Shared Room</SelectItem>
                            <SelectItem value="apartment" className="font-bold text-xs">Whole Apartment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location / Address</Label>
                      <Input placeholder="e.g. K. Valdemāra iela 21, Riga" className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description & Amenities</Label>
                      <Textarea placeholder="Detail the utilities, furniture, and neighborhood perks..." className="min-h-[100px] rounded-2xl bg-slate-50 border-none font-bold text-xs p-4" />
                    </div>

                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-green-700 shadow-sm shrink-0">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-green-700/70 font-medium leading-relaxed uppercase tracking-wider">
                        Unit will enter 'Pending Verification' status until physically inspected by an agent.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 shrink-0">
                  <DialogFooter>
                    <Button className="w-full h-14 rounded-2xl bg-green-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-green-700/20 hover:bg-green-800 transition-all">
                      Initialize Listing Node
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
             <Input placeholder="Search areas, unit types or status..." className="h-10 pl-9 rounded-lg bg-slate-50 border-none focus:bg-white transition-all font-bold text-xs" />
           </div>
           <div className="flex gap-2">
             <Button variant="outline" className="h-10 rounded-lg font-black border-slate-200 gap-2 text-[10px] px-4">
               <Filter className="h-3.5 w-3.5" /> Filters
             </Button>
           </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <Card key={item.id} className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="relative aspect-video overflow-hidden">
                <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-4 left-4">
                  <Badge className={`border-none font-black text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-lg shadow-lg ${item.status === 'Verified' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
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
                    <CardTitle className="text-sm font-black text-slate-900 group-hover:text-green-700 transition-colors truncate">{item.title}</CardTitle>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      <MapPin className="h-3 w-3 text-green-700" /> {item.location}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-black text-green-700 tracking-tighter leading-none italic">€{item.price}</p>
                    <p className="text-[7px] font-black text-slate-400 uppercase mt-1">/ Month</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-6 py-4 space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Inventory</span>
                  </div>
                  <Badge variant="outline" className="text-[7px] h-5 px-2 border-green-100 text-green-700 font-black uppercase">
                    {item.type}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Total Leads</p>
                    <p className="text-xs font-black text-slate-700">{item.leads} Students</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Trust Score</p>
                    <p className="text-xs font-black text-slate-700">Level 5</p>
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
