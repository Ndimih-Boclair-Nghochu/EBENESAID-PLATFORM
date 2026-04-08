'use client';

import { useState } from "react";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Utensils, 
  Search, 
  Filter, 
  Clock, 
  Star, 
  ShoppingBag, 
  Heart, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  MapPin,
  CheckCircle2,
  Navigation,
  Info,
  CreditCard,
  User,
  Phone,
  MessageSquare,
  MessagesSquare
} from "lucide-react";
import Image from "next/image";
import { SpecialistChat } from "@/components/SpecialistChat";
import { discussKitchen } from "@/ai/flows/kitchen-specialist-flow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const menuItems = [
  { id: 1, name: "Jollof Rice & Plantain", price: 8.50, deliveryFee: 1.50, kitchen: "West African Hub", time: "25m", rating: 4.9, img: "https://picsum.photos/seed/jollof/400/300", tags: ["Bestseller", "Spicy"] },
  { id: 2, name: "Latvian Dumplings (Pelmeņi)", price: 6.50, deliveryFee: 1.00, kitchen: "Riga Local Eats", time: "15m", rating: 4.7, img: "https://picsum.photos/seed/dumplings/400/300", tags: ["Local", "Student Favorite"] },
  { id: 3, name: "Chicken Tikka Masala", price: 9.00, deliveryFee: 2.00, kitchen: "Indo-Baltic Spice", time: "30m", rating: 4.8, img: "https://picsum.photos/seed/curry/400/300", tags: ["Verified", "Halal"] },
];

export default function FoodMarketplacePage() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [fulfillment, setFulfillment] = useState("Delivery");
  const { toast } = useToast();

  // Form States
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [apartment, setApartment] = useState("");
  const [orderNote, setOrderNote] = useState("");

  const handleConfirmOrder = () => {
    if (!contactName || !contactPhone) {
      toast({
        title: "Information Required",
        description: "Please provide your name and phone number to initialize the order.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Order Initialized",
      description: `Your ${selectedItem?.name} order is being prepared for ${fulfillment}.`,
    });
    
    // Reset selection and form
    setSelectedItem(null);
    setContactName("");
    setContactPhone("");
    setStreet("");
    setBuilding("");
    setApartment("");
    setOrderNote("");
  };

  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
        {/* Compact Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Supply Node • Verified Delivery
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Hygiene Certified
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Food <span className="text-primary">Supply</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider">Verified meals delivered to your house or available for pickup.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto">
              <ShoppingBag className="h-3.5 w-3.5 text-primary" /> My Orders
            </Button>
          </div>
        </div>

        {/* AI Specialist Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <SpecialistChat 
              title="Kitchen Specialist"
              specialty="Dietary & Logistics Expert"
              initialMessage="Hungry? I can help you find Halal options in Centrs, recommend the best Jollof rice in Riga, or arrange delivery to your verified apartment. What's on the menu today?"
              flow={discussKitchen}
              icon={<Utensils className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="rounded-[1.5rem] bg-slate-900 text-white p-6 relative overflow-hidden shadow-xl border-none h-full min-h-[120px] flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="flex items-center gap-2 text-primary mb-4 relative z-10">
                <MapPin className="h-4 w-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Delivery Network</p>
              </div>
              <p className="text-xs font-medium text-slate-300 leading-relaxed italic relative z-10 border-l-2 border-primary/40 pl-4 py-1">
                "Verified kitchens are delivering 450+ meals across Riga student districts today."
              </p>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 space-y-5">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
               <div className="flex-1 relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                 <input placeholder="Cuisines, kitchens or specific dishes..." className="w-full h-10 pl-9 rounded-lg bg-slate-50 border-none focus:bg-white transition-all font-bold text-xs outline-none" />
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" className="h-10 rounded-lg font-black border-slate-200 gap-2 text-[10px] px-4 flex-1"><Filter className="h-3.5 w-3.5" /> Filters</Button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <Card key={item.id} className="overflow-hidden border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-xl transition-all duration-500">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute top-4 right-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur shadow-sm text-slate-400 hover:text-red-500"><Heart className="h-4 w-4" /></Button>
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                      {item.tags.map((tag, idx) => (
                        <Badge key={idx} className="bg-white/95 backdrop-blur text-primary font-black text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-lg border-none">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardHeader className="p-5 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1 min-w-0">
                        <CardTitle className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight leading-none truncate">{item.name}</CardTitle>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{item.kitchen}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-black text-primary tracking-tighter leading-none">€{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 flex items-center gap-4 border-b border-slate-50">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-slate-300 shrink-0" />
                      <span className="text-[9px] font-black text-slate-400 uppercase">{item.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
                      <span className="text-[9px] font-black text-slate-900">{item.rating}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 flex gap-2">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl shrink-0 text-slate-400 hover:text-primary hover:bg-primary/5 border border-slate-100" asChild>
                      <Link href="/messages"><MessagesSquare className="h-4 w-4" /></Link>
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1 h-10 rounded-xl font-black text-[10px] shadow-lg shadow-primary/20 uppercase tracking-widest gap-2" onClick={() => setSelectedItem(item)}>
                          <ShoppingBag className="h-3.5 w-3.5" /> Initialize Order
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white max-w-[500px] w-[95vw] max-h-[85vh] flex flex-col">
                        <div className="bg-primary p-6 sm:p-8 text-white relative shrink-0">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                          <DialogHeader className="relative z-10 text-left">
                            <DialogTitle className="text-xl sm:text-2xl font-black italic tracking-tight uppercase leading-none text-white">Order <span className="opacity-70">Checkout</span></DialogTitle>
                            <DialogDescription className="text-primary-foreground/70 font-bold uppercase tracking-[0.2em] text-[8px] sm:text-[10px] mt-2">
                              Fulfillment Node Protocol
                            </DialogDescription>
                          </DialogHeader>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                          <div className="p-6 sm:p-8 space-y-8">
                            {/* Dish Summary */}
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <div className="h-14 w-14 rounded-xl overflow-hidden shadow-sm shrink-0 border-2 border-white">
                                <img src={item.img} alt={item.name} className="object-cover w-full h-full" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-black text-slate-900 truncate">{item.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{item.kitchen}</p>
                              </div>
                              <div className="ml-auto text-right">
                                <p className="text-base font-black text-primary italic">€{item.price.toFixed(2)}</p>
                              </div>
                            </div>

                            {/* Fulfillment Selector */}
                            <div className="space-y-4">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Fulfillment Method</Label>
                              <RadioGroup defaultValue="Delivery" onValueChange={setFulfillment} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className={`flex items-center space-x-2 rounded-xl border p-3 transition-all cursor-pointer ${fulfillment === 'Delivery' ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                                  <RadioGroupItem value="Delivery" id="delivery" className="sr-only" />
                                  <Label htmlFor="delivery" className="flex flex-col items-center gap-2 cursor-pointer w-full text-center">
                                    <Navigation className={`h-4 w-4 ${fulfillment === 'Delivery' ? 'text-primary' : 'text-slate-400'}`} />
                                    <span className="text-[9px] font-black uppercase">House Delivery</span>
                                  </Label>
                                </div>
                                <div className={`flex items-center space-x-2 rounded-xl border p-3 transition-all cursor-pointer ${fulfillment === 'Pickup' ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                                  <RadioGroupItem value="Pickup" id="pickup" className="sr-only" />
                                  <Label htmlFor="pickup" className="flex flex-col items-center gap-2 cursor-pointer w-full text-center">
                                    <ShoppingBag className={`h-4 w-4 ${fulfillment === 'Pickup' ? 'text-primary' : 'text-slate-400'}`} />
                                    <span className="text-[9px] font-black uppercase">Self Pickup</span>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-4">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Metadata</Label>
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 ml-1">
                                    <User className="h-3.5 w-3.5 text-slate-300" />
                                    <Label className="text-[9px] font-black uppercase text-slate-400">Full Name</Label>
                                  </div>
                                  <Input 
                                    placeholder="e.g. Louis D." 
                                    value={contactName} 
                                    onChange={(e) => setContactName(e.target.value)} 
                                    className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs" 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 ml-1">
                                    <Phone className="h-3.5 w-3.5 text-slate-300" />
                                    <Label className="text-[9px] font-black uppercase text-slate-400">Phone Number (LV)</Label>
                                  </div>
                                  <Input 
                                    placeholder="+371 ..." 
                                    value={contactPhone} 
                                    onChange={(e) => setContactPhone(e.target.value)} 
                                    className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs" 
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Delivery Address (Conditional) */}
                            {fulfillment === 'Delivery' && (
                              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Delivery Coordinates</Label>
                                <div className="grid gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase text-slate-400 ml-1">Street Address</Label>
                                    <Input 
                                      placeholder="e.g. K. Valdemāra iela" 
                                      value={street} 
                                      onChange={(e) => setStreet(e.target.value)} 
                                      className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs" 
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-[9px] font-black uppercase text-slate-400 ml-1">Bldg No.</Label>
                                      <Input 
                                        placeholder="e.g. 21" 
                                        value={building} 
                                        onChange={(e) => setBuilding(e.target.value)} 
                                        className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs" 
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-[9px] font-black uppercase text-slate-400 ml-1">Apt No.</Label>
                                      <Input 
                                        placeholder="e.g. 4B" 
                                        value={apartment} 
                                        onChange={(e) => setApartment(e.target.value)} 
                                        className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs" 
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Notes */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 ml-1">
                                <MessageSquare className="h-3.5 w-3.5 text-slate-300" />
                                <Label className="text-[9px] font-black uppercase text-slate-400">Order Note (Optional)</Label>
                              </div>
                              <Textarea 
                                placeholder="Allergies, door codes, or special instructions..." 
                                value={orderNote} 
                                onChange={(e) => setOrderNote(e.target.value)} 
                                className="min-h-[80px] rounded-2xl bg-slate-50 border-none font-bold text-xs p-4" 
                              />
                            </div>

                            {/* Billing Matrix */}
                            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>€{item.price.toFixed(2)}</span>
                              </div>
                              {fulfillment === 'Delivery' && (
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                  <span>Delivery Fee</span>
                                  <span>€{item.deliveryFee.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="h-px bg-slate-200 my-1" />
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-slate-900 uppercase italic">Grand Total</span>
                                <span className="text-xl font-black text-primary italic">
                                  €{(item.price + (fulfillment === 'Delivery' ? item.deliveryFee : 0)).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
                          <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" onClick={handleConfirmOrder}>
                            Confirm & Pay Now
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}
