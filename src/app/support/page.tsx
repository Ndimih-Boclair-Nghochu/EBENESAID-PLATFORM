
'use client';

import { useState } from "react";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  LifeBuoy, 
  Activity, 
  ShieldCheck, 
  MessageSquare,
  Clock,
  MoreVertical,
  CheckCircle2,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SpecialistChat } from "@/components/SpecialistChat";
import { discussDocuments } from "@/ai/flows/document-specialist-flow";

export default function GeneralSupportPage() {
  const [chatInput, setChatInput] = useState("");

  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10 h-[calc(100vh-140px)]">
        
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Support Node • Authorized Channel
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Support Online
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">System <span className="text-primary">Support</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider hidden sm:block">Direct line to EBENESAID super administrators for technical or legal assistance.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 flex-1 min-h-0">
          {/* AI Specialist Section */}
          <div className="lg:col-span-4 space-y-6 flex flex-col">
            <SpecialistChat 
              title="System Concierge"
              specialty="General Protocol Specialist"
              initialMessage="I can provide immediate guidance on platform features or escalate complex issues to our super admins. What do you need help with?"
              flow={discussDocuments}
              icon={<ShieldCheck className="h-4 w-4" />}
            />
            
            <Card className="rounded-[2rem] bg-slate-900 text-white p-6 relative overflow-hidden shadow-xl border-none flex-1 flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px]" />
              <div className="flex items-center gap-2 text-primary mb-6 relative z-10">
                <Lock className="h-4 w-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Encrypted Session</p>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[10px] font-black text-white leading-none mb-2">Secure Channel Active</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    Messages are protected by AES-256 and accessible only by Super Admins.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-0">
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white h-full flex flex-col overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <LifeBuoy className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-black text-slate-900 leading-none">Admin Direct</CardTitle>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Support Response: ~15m</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-primary"><MoreVertical className="h-4 w-4" /></Button>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
                <SupportMessage role="system" time="Yesterday" content="Welcome to the official EBENESAID support channel. How can we assist your relocation today?" />
                <SupportMessage role="user" time="Today, 10:15 AM" content="Hi, I'm having trouble uploading my Latvian visa scan. It keeps saying 'Format Error'." />
                <SupportMessage role="admin" time="Today, 10:20 AM" content="Hello! This usually happens if the file is larger than 10MB. Please try compressing the image or using a PDF format. I've reset your upload node for that document." />
              </CardContent>

              <CardFooter className="p-4 border-t border-slate-50 bg-white shrink-0">
                <div className="flex w-full gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 focus-within:border-primary transition-all">
                  <Input 
                    placeholder="Describe your issue..." 
                    className="h-10 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold px-4 text-slate-700 text-xs flex-1" 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                  />
                  <Button size="icon" className="h-10 w-10 rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white border-none shrink-0"><Send className="h-4 w-4" /></Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function SupportMessage({ role, time, content }: any) {
  const isUser = role === 'user';
  const isSystem = role === 'system';

  return (
    <div className={cn("flex gap-3 animate-in slide-in-from-bottom-2 duration-300", isUser && "flex-row-reverse")}>
      {!isUser && (
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-[8px] font-black text-white shrink-0 shadow-sm", isSystem ? "bg-slate-800" : "bg-primary")}>
          {isSystem ? 'SYS' : 'ADM'}
        </div>
      )}
      {isUser && (
        <div className="h-8 w-8 rounded-lg bg-slate-200 flex items-center justify-center text-[8px] font-black text-slate-600 shrink-0 shadow-sm">
          ME
        </div>
      )}
      <div className={cn(
        "max-w-[85%] p-3.5 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm border",
        isUser ? "bg-primary text-white border-transparent rounded-tr-none" : 
        isSystem ? "bg-slate-800 text-white border-slate-700 rounded-tl-none italic" :
        "bg-white text-slate-600 border-slate-100 rounded-tl-none"
      )}>
        {content}
        <div className={cn("text-[7px] font-black uppercase tracking-widest mt-2 opacity-50", isUser || isSystem ? "text-white" : "text-slate-400")}>
          {time}
        </div>
      </div>
    </div>
  );
}
