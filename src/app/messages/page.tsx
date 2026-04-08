
'use client';

import { useState } from "react";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MessageSquare, 
  Send, 
  MoreVertical, 
  ChevronLeft,
  Activity,
  MessagesSquare,
  Filter,
  User,
  Hotel,
  Soup,
  Building2,
  Phone,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const contacts = [
  { id: 'u1', name: "Louis D.", type: "Student", lastMsg: "Checking food order status.", time: "2m ago", unread: 1, icon: User },
  { id: 'u2', name: "Sia LatProp", type: "Housing Agent", lastMsg: "Listing #882 is verified.", time: "15m ago", unread: 0, icon: Hotel },
  { id: 'u3', name: "West African Hub", type: "Food Supplier", lastMsg: "Delivery at Valdemāra 21.", time: "1h ago", unread: 0, icon: Soup },
  { id: 'u4', name: "RTU Riga", type: "University", lastMsg: "Handshake sync successful.", time: "4h ago", unread: 0, icon: Building2 },
];

export default function GlobalMessagesPage() {
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");

  const activeContact = contacts.find(c => c.id === activeContactId);

  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10 h-[calc(100vh-140px)]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Messaging Node • Peer Network
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Direct Sync Active
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Global <span className="text-primary">Inbox</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider hidden sm:block">Direct peer-to-peer communication across students, agents, and suppliers.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 flex-1 min-h-0 relative">
          {/* Contact List Sidebar */}
          <div className={cn(
            "lg:col-span-4 flex flex-col h-full absolute inset-0 lg:relative z-20 bg-slate-50/50 lg:bg-transparent transition-transform duration-300",
            activeContactId ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
          )}>
            <Card className="border-slate-100 shadow-sm rounded-[2rem] bg-white overflow-hidden flex flex-col h-full">
              <CardHeader className="p-5 pb-2 border-b border-slate-50 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Conversations</p>
                  <Filter className="h-3.5 w-3.5 text-slate-200 hover:text-primary cursor-pointer transition-colors" />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                  <Input placeholder="Search people or roles..." className="h-9 pl-8 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-slate-50">
                  {contacts.map((c) => (
                    <div 
                      key={c.id} 
                      onClick={() => setActiveContactId(c.id)}
                      className={cn("flex items-center justify-between group cursor-pointer p-4 transition-all", activeContactId === c.id ? "bg-primary/5 border-l-2 border-primary" : "hover:bg-slate-50 border-l-2 border-transparent")}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shadow-inner shrink-0 transition-all", activeContactId === c.id ? "bg-primary text-white" : "bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white")}>
                          <c.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={cn("text-[11px] font-black transition-colors truncate leading-none", activeContactId === c.id ? "text-primary" : "text-slate-900")}>{c.name}</p>
                            {c.unread > 0 && <Badge className="bg-primary text-white text-[7px] font-black h-3 px-1 rounded-full">{c.unread}</Badge>}
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{c.type}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">{c.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Chat Area */}
          <div className={cn(
            "lg:col-span-8 h-full flex flex-col absolute inset-0 lg:relative z-30 transition-transform duration-300 bg-slate-50/50 lg:bg-transparent",
            !activeContactId ? "translate-x-full lg:translate-x-0" : "translate-x-0"
          )}>
            {activeContactId ? (
              <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white h-full flex flex-col overflow-hidden">
                <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <Button variant="ghost" size="icon" onClick={() => setActiveContactId(null)} className="lg:hidden h-8 w-8 rounded-lg shrink-0">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                      <activeContact.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-black text-slate-900 leading-none truncate">{activeContact?.name}</CardTitle>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 truncate">{activeContact?.type} Node</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-primary"><Phone className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-primary"><MoreVertical className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
                  <PeerMessage role="other" name={activeContact?.name} time="10:15 AM" content="Hi, I'm reaching out regarding the update on the platform. Is everything okay with the current node sync?" />
                  <PeerMessage role="me" name="Me" time="10:20 AM" content="Hello! Yes, all systems are operational. I'm just reviewing the latest data ingestion results now." />
                </CardContent>

                <CardFooter className="p-4 border-t border-slate-50 bg-white shrink-0">
                  <div className="flex w-full gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 focus-within:border-primary transition-all">
                    <Input 
                      placeholder={`Message ${activeContact?.name}...`} 
                      className="h-10 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold px-4 text-slate-700 text-xs flex-1" 
                      value={chatInput} 
                      onChange={(e) => setChatInput(e.target.value)} 
                    />
                    <Button size="icon" className="h-10 w-10 rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white border-none shrink-0"><Send className="h-4 w-4" /></Button>
                  </div>
                </CardFooter>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-12 bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
                <div className="space-y-4 max-w-xs">
                  <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto">
                    <MessagesSquare className="h-8 w-8" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Messaging Node</h3>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">Select a peer from the directory to start a high-fidelity conversation.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function PeerMessage({ role, name, time, content }: any) {
  const isMe = role === 'me';
  return (
    <div className={cn("flex gap-3 animate-in slide-in-from-bottom-2 duration-300", isMe && "flex-row-reverse")}>
      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-[8px] font-black text-white shrink-0 shadow-sm", isMe ? "bg-primary" : "bg-slate-800")}>
        {isMe ? 'ME' : 'USR'}
      </div>
      <div className={cn(
        "max-w-[85%] p-3.5 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm border",
        isMe ? "bg-primary text-white border-transparent rounded-tr-none" : "bg-white text-slate-600 border-slate-100 rounded-tl-none"
      )}>
        <p className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-50">{name}</p>
        {content}
        <div className={cn("text-[7px] font-black uppercase tracking-widest mt-2", isMe ? "text-primary-foreground/50" : "text-slate-300")}>{time}</div>
      </div>
    </div>
  );
}
