'use client';

import { useState } from "react";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Heart, 
  MapPin, 
  Sparkles, 
  ArrowUpRight, 
  Globe,
  Clock,
  MoreHorizontal,
  Send,
  ChevronLeft,
  Search,
  Hash
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SpecialistChat } from "@/components/SpecialistChat";
import { discussCommunity } from "@/ai/flows/social-specialist-flow";

const popularCircles = [
  { id: 'c1', name: "RTU International", members: "1.2k", description: "Official hub for all international students at RTU." },
  { id: 'c2', name: "Riga Flatmates", members: "800", description: "Find verified roommates and shared housing tips." },
  { id: 'c3', name: "West African Students", members: "150", description: "Cultural connection and support for West African talent." },
  { id: 'c4', name: "Tech & Innovation", members: "450", description: "For the builders and dreamers in the Baltic tech scene." },
];

export default function CommunityPage() {
  const [activeCircleId, setActiveCircleId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");

  const activeCircle = popularCircles.find(c => c.id === activeCircleId);

  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
        {/* Compact Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Social Node • {activeCircleId ? activeCircle?.name : 'Active'}
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[8px] font-black uppercase tracking-widest">
                <Sparkles className="h-2.5 w-2.5" /> AI Matching Live
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
              {activeCircleId ? activeCircle?.name : 'Student Circle'}
            </h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider">
              {activeCircleId ? activeCircle?.description : 'Orchestrated peer connections and community engagement.'}
            </p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            {activeCircleId && (
              <Button variant="ghost" size="sm" onClick={() => setActiveCircleId(null)} className="h-9 px-4 rounded-xl font-bold text-slate-400 hover:text-primary gap-2 text-[10px]">
                <ChevronLeft className="h-3.5 w-3.5" /> Exit Circle
              </Button>
            )}
            <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-primary/20 gap-2 text-[10px] w-full sm:w-auto">
              <Users className="h-3.5 w-3.5" /> Find a Buddy
            </Button>
          </div>
        </div>

        {/* AI Specialist Console */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <SpecialistChat 
              title="Social Specialist"
              specialty="Community & Cultural Integration Expert"
              initialMessage="Welcome to the Circle. I can help you find specialized student groups (e.g., West African, IT), recommend local cultural hotspots, or explain our origin-based matching algorithm. Who are you looking to connect with?"
              flow={discussCommunity}
              icon={<Users className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="rounded-[1.5rem] bg-slate-900 text-white p-6 relative overflow-hidden shadow-xl border-none h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="flex items-center gap-2 text-primary mb-4 relative z-10">
                <Sparkles className="h-4 w-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Matching Engine</p>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                  <Avatar className="h-10 w-10 rounded-lg border border-primary/40">
                    <AvatarFallback className="bg-primary text-white font-black text-[10px]">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs text-white leading-none">John D. <Badge className="bg-primary text-white text-[7px] font-black px-1 py-0.5 rounded-full ml-1">98%</Badge></p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">Nigeria • RTU 2025</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation - Circles List */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="border-slate-100 shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="p-5 pb-2 border-b border-slate-50 flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Popular Circles</p>
                <Globe className="h-3 w-3 text-slate-200" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {popularCircles.map((circle) => (
                    <GroupItem key={circle.id} name={circle.name} members={circle.members} isActive={activeCircleId === circle.id} onClick={() => setActiveCircleId(circle.id)} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Social Feed / Chat Area */}
          <div className="lg:col-span-8 space-y-6">
            {!activeCircleId ? (
              <div className="space-y-4">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" /> Active Feed
                </h2>
                <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                   <div className="divide-y divide-slate-50">
                     <Post author="Kofi Mensah" time="2h ago" content="Does anyone know the fastest way to get to the Immigration Office (PMLP)?" />
                     <Post author="Ananya S." time="5h ago" content="Looking for 2 more people for a weekend trip to Sigulda! We have a car." />
                   </div>
                </Card>
              </div>
            ) : (
              <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white h-[600px] flex flex-col overflow-hidden">
                <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Hash className="h-5 w-5" /></div>
                    <div>
                      <CardTitle className="text-base font-black text-slate-900 leading-none">{activeCircle?.name}</CardTitle>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{activeCircle?.members} Members • 12 Online</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
                  <ChatMessage author="Ebenezer" time="10:15 AM" content="Has anyone already submitted their PMLP documents for this month?" avatar="https://picsum.photos/seed/ebenezer/100/100" />
                </CardContent>
                <CardFooter className="p-4 border-t border-slate-50 bg-white shrink-0">
                  <div className="flex w-full gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    <Input placeholder={`Message ${activeCircle?.name}...`} className="h-10 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold px-4 text-slate-700 text-xs flex-1" value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
                    <Button size="icon" className="h-10 w-10 rounded-xl shadow-lg shadow-primary/20"><Send className="h-4 w-4" /></Button>
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function GroupItem({ name, members, onClick, isActive }: any) {
  return (
    <div onClick={onClick} className={cn("flex items-center justify-between group cursor-pointer p-3.5 transition-all", isActive ? "bg-primary/5 border-l-2 border-primary" : "hover:bg-slate-50 border-l-2 border-transparent")}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn("h-7 w-7 rounded-lg transition-all flex items-center justify-center font-black text-[8px] shrink-0", isActive ? "bg-primary text-white" : "bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white")}>{name.charAt(0)}</div>
        <div className="min-w-0">
          <p className={cn("text-[10px] font-black transition-colors truncate leading-none mb-1", isActive ? "text-primary" : "text-slate-900 group-hover:text-primary")}>{name}</p>
          <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none">{members} Members</p>
        </div>
      </div>
      <ArrowUpRight className={cn("h-2.5 w-2.5 transition-all shrink-0", isActive ? "text-primary" : "text-slate-200 group-hover:text-primary")} />
    </div>
  );
}

function Post({ author, time, content }: any) {
  return (
    <div className="p-4 group/post hover:bg-slate-50/50 transition-all cursor-pointer flex items-start gap-3">
      <Avatar className="h-8 w-8 rounded-lg shadow-sm shrink-0">
        <AvatarFallback className="bg-primary text-white font-black text-[8px]">{author.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-black text-slate-900 group-hover/post:text-primary transition-colors leading-none">{author}</p>
          <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{time}</p>
        </div>
        <p className="text-[10px] text-slate-600 font-medium leading-relaxed italic line-clamp-2">"{content}"</p>
      </div>
    </div>
  );
}

function ChatMessage({ author, time, content, avatar }: any) {
  return (
    <div className="flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300">
      <Avatar className="h-8 w-8 rounded-lg shadow-sm shrink-0 mt-0.5">
        <AvatarImage src={avatar} />
        <AvatarFallback className="bg-slate-200 text-slate-600 font-black text-[8px]">{author.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-black leading-none text-slate-900">{author}</p>
          <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{time}</p>
        </div>
        <div className="p-3 rounded-2xl text-[11px] font-medium leading-relaxed bg-white text-slate-600 border border-slate-100 shadow-sm">
          {content}
        </div>
      </div>
    </div>
  );
}
