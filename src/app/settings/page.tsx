'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Globe, 
  Database, 
  Activity, 
  Save, 
  ArrowUpRight,
  LogOut,
  Settings as SettingsIcon,
  ShieldAlert,
  Mail,
  Smartphone,
  MessageSquare,
  Camera,
  CheckCircle2,
  MapPin,
  Home
} from "lucide-react";
import { SpecialistChat } from "@/components/SpecialistChat";
import { discussSettings } from "@/ai/flows/settings-specialist-flow";
import { UNIVERSITIES, NATIONALITIES } from "@/lib/constants";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Compact Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                System Node • Localized (LV)
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Integrity Active
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">System Configuration</h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider">Manage your identity, institutional sync, and global mobility parameters.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-primary/20 gap-2 text-[10px] w-full sm:w-auto">
              <Save className="h-3.5 w-3.5" /> Save Configuration
            </Button>
          </div>
        </div>

        {/* AI Specialist SECTION */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <SpecialistChat 
              title="Settings Specialist"
              specialty="Security & Privacy Expert"
              initialMessage="I can help you understand our EU data encryption protocols or guide you through setting up your email and mobile alerts. What's on your mind?"
              flow={discussSettings}
              icon={<ShieldCheck className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="rounded-[1.5rem] bg-slate-900 text-white p-6 relative overflow-hidden shadow-xl border-none h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="flex items-center gap-2 text-primary mb-4 relative z-10">
                <Lock className="h-4 w-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Encrypted Session</p>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <p className="text-[10px] font-black text-white leading-none">Institutional 2FA</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Last login: 2m ago from Riga, LV</p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="w-full mt-4 h-10 rounded-xl text-[9px] font-black text-red-400 hover:bg-red-50 hover:text-red-500 uppercase tracking-widest gap-2 border-red-900/20">
                  Sign Out <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 pb-10">
          {/* Main Settings Inventory */}
          <div className="lg:col-span-12 space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Identity & Profile */}
              <Card className="shadow-sm border-slate-100 rounded-[2rem] bg-white overflow-hidden">
                <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <CardTitle className="text-sm font-black text-slate-900">Identity Profile</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-50">
                    <div className="relative group">
                      <Avatar className="h-20 w-20 rounded-[1.5rem] border-4 border-slate-50 shadow-xl">
                        <AvatarImage src="https://picsum.photos/seed/user-louis/200/200" />
                        <AvatarFallback className="bg-primary text-white font-black">LD</AvatarFallback>
                      </Avatar>
                      <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-all text-white backdrop-blur-sm">
                        <Camera className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-900">Profile Imagery</h4>
                      <Button variant="outline" size="sm" className="h-7 rounded-lg text-[8px] font-black uppercase tracking-widest">Change Photo</Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Legal Name</Label>
                      <Input defaultValue="Louis D." className="h-10 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                      <Input defaultValue="louis@ebenesaid.com" className="h-10 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Institutional Sync */}
              <Card className="shadow-sm border-slate-100 rounded-[2rem] bg-white overflow-hidden">
                <CardHeader className="p-5 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Globe className="h-4.5 w-4.5" />
                    </div>
                    <CardTitle className="text-sm font-black text-slate-900">Institutional Sync</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target University</Label>
                      <Select defaultValue="rtu">
                        <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-none font-bold text-xs">
                          <SelectValue placeholder="Select Institution" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl max-h-[200px]">
                          {UNIVERSITIES.map((uni) => (
                            <SelectItem key={uni.id} value={uni.id} className="font-bold text-xs rounded-lg">
                              {uni.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Citizenship</Label>
                      <Select defaultValue="nigerian">
                        <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-none font-bold text-xs">
                          <SelectValue placeholder="Select Nationality" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl max-h-[200px]">
                          {NATIONALITIES.map((nat) => (
                            <SelectItem key={nat} value={nat.toLowerCase()} className="font-bold text-xs rounded-lg">
                              {nat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Coordinates - ESSENTIAL FOR FOOD ORDERS */}
              <Card className="shadow-sm border-slate-100 rounded-[2rem] bg-white overflow-hidden">
                <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                      <MapPin className="h-4.5 w-4.5" />
                    </div>
                    <CardTitle className="text-sm font-black text-slate-900">Delivery Coordinates</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Street Address</Label>
                    <Input placeholder="e.g. K. Valdemāra iela" className="h-10 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Building No.</Label>
                      <Input placeholder="e.g. 21" className="h-10 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Apartment</Label>
                      <Input placeholder="e.g. 4B" className="h-10 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">City</Label>
                      <Input defaultValue="Riga" className="h-10 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Postal Code</Label>
                      <Input placeholder="LV-1010" className="h-10 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 flex items-center gap-2 mt-2">
                    <Home className="h-3.5 w-3.5 text-orange-600" />
                    <p className="text-[8px] font-bold text-orange-700 uppercase tracking-widest">Saved for Food Supply orders</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}
