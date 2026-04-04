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
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

const chatStudents = [
  { id: 's1', name: "Louis D.", country: "Nigeria", lastMsg: "Thank you for the update.", time: "2m ago", unread: 0 },
  { id: 's2', name: "Maria K.", country: "Kazakhstan", lastMsg: "When is the orientation?", time: "15m ago", unread: 2 },
  { id: 's3', name: "Kofi Mensah", country: "Ghana", lastMsg: "Document submitted.", time: "1h ago", unread: 0 },
  { id: 's4', name: "Ananya S.", country: "India", lastMsg: "I arrived at RIX today.", time: "4h ago", unread: 0 },
];

export default function UniversityMessagingPage() {
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");

  const activeStudent = chatStudents.find(s => s.id === activeStudentId);

  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10 h-[calc(100vh-140px)]">
        
        {/* Header - Stays visible */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-indigo-400/20 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Communication Node • Secure
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Support Active
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Student <span className="text-indigo-600">Direct</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider hidden sm:block">Direct institutional protocol updates and student support messaging.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 flex-1 min-h-0 relative">
          {/* Student List Sidebar - Hidden on mobile if chat is active */}
          <div className={cn(
            "lg:col-span-4 flex flex-col h-full absolute inset-0 lg:relative z-20 bg-slate-50/50 lg:bg-transparent",
            activeStudentId ? "hidden lg:flex" : "flex"
          )}>
            <Card className="border-slate-100 shadow-sm rounded-[1.5rem] sm:rounded-[2rem] bg-white overflow-hidden flex flex-col h-full">
              <CardHeader className="p-4 sm:p-5 pb-2 border-b border-slate-50 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Cohort Conversations</p>
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                  <Input placeholder="Search students..." className="h-9 pl-8 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-slate-50">
                  {chatStudents.map((s) => (
                    <div 
                      key={s.id} 
                      onClick={() => setActiveStudentId(s.id)}
                      className={cn("flex items-center justify-between group cursor-pointer p-4 transition-all", activeStudentId === s.id ? "bg-indigo-50 border-l-2 border-indigo-600" : "hover:bg-slate-50 border-l-2 border-transparent")}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10 rounded-xl shadow-sm shrink-0">
                          <AvatarImage src={`https://picsum.photos/seed/${s.id}/100/100`} />
                          <AvatarFallback className="bg-slate-200 text-slate-600 font-black text-[10px]">{s.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={cn("text-[11px] font-black transition-colors truncate leading-none", activeStudentId === s.id ? "text-indigo-600" : "text-slate-900")}>{s.name}</p>
                            {s.unread > 0 && <Badge className="bg-indigo-600 text-white text-[7px] font-black h-3 px-1">{s.unread}</Badge>}
                          </div>
                          <p className="text-[9px] text-slate-400 font-medium truncate mt-1.5 italic">"{s.lastMsg}"</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">{s.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Chat Area - Full width on mobile when active */}
          <div className={cn(
            "lg:col-span-8 h-full flex flex-col absolute inset-0 lg:relative z-30",
            !activeStudentId ? "hidden lg:flex" : "flex"
          )}>
            {activeStudentId ? (
              <Card className="rounded-[1.5rem] sm:rounded-[2.5rem] border-slate-100 shadow-sm bg-white h-full flex flex-col overflow-hidden">
                <CardHeader className="p-4 sm:p-5 border-b border-slate-50 flex flex-row items-center justify-between shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <Button variant="ghost" size="icon" onClick={() => setActiveStudentId(null)} className="lg:hidden h-8 w-8 rounded-lg shrink-0">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl shadow-sm border border-slate-100 shrink-0">
                      <AvatarImage src={`https://picsum.photos/seed/${activeStudent?.id}/100/100`} />
                      <AvatarFallback className="bg-indigo-600 text-white font-black text-xs">{activeStudent?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-black text-slate-900 leading-none truncate">{activeStudent?.name}</CardTitle>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 truncate">{activeStudent?.country} • Student Node</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-indigo-600 shrink-0"><MoreVertical className="h-4 w-4" /></Button>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
                  <ChatMessage role="student" time="10:15 AM" content="Has my orientation packet been approved yet?" />
                  <ChatMessage role="university" time="10:30 AM" content="Yes, Louis. Your documents are verified. You should see the update in your Dashboard now." />
                  <ChatMessage role="student" time="10:32 AM" content="Excellent, thank you for the fast response!" />
                </CardContent>

                <CardFooter className="p-3 sm:p-4 border-t border-slate-50 bg-white shrink-0">
                  <div className="flex w-full gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    <Input 
                      placeholder="Send update..." 
                      className="h-9 sm:h-10 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold px-3 sm:px-4 text-slate-700 text-xs flex-1" 
                      value={chatInput} 
                      onChange={(e) => setChatInput(e.target.value)} 
                    />
                    <Button size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl shadow-lg shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700 text-white border-none shrink-0"><Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></Button>
                  </div>
                </CardFooter>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-12 bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
                <div className="space-y-4 max-w-xs">
                  <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto">
                    <MessageSquare className="h-8 w-8" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Initialize Support Node</h3>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">Select a student from the cohort registry to begin direct communication.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function ChatMessage({ role, time, content }: any) {
  const isUni = role === 'university';
  return (
    <div className={cn("flex gap-3 animate-in slide-in-from-bottom-2 duration-300", isUni && "flex-row-reverse")}>
      <div className={cn("h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center text-[7px] sm:text-[8px] font-black text-white shrink-0 shadow-sm", isUni ? "bg-indigo-600" : "bg-slate-800")}>
        {isUni ? 'UNI' : 'STU'}
      </div>
      <div className={cn("max-w-[85%] p-3 sm:p-3.5 rounded-2xl text-[10px] sm:text-[11px] font-medium leading-relaxed shadow-sm border", isUni ? "bg-indigo-600 text-white border-indigo-500 rounded-tr-none" : "bg-white text-slate-600 border-slate-100 rounded-tl-none")}>
        {content}
        <div className={cn("text-[6px] sm:text-[7px] font-black uppercase tracking-widest mt-2", isUni ? "text-indigo-200" : "text-slate-300")}>{time}</div>
      </div>
    </div>
  );
}
