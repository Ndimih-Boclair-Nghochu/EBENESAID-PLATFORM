'use client';

import { useEffect, useState } from "react";
import { LifeBuoy, Send, ShieldCheck } from "lucide-react";

import { discussDocuments } from "@/ai/flows/document-specialist-flow";
import { SpecialistChat } from "@/components/SpecialistChat";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SupportMessage = {
  id: number;
  role: "user" | "admin" | "system";
  time: string;
  content: string;
};

export default function GeneralSupportPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function loadSupport() {
    const res = await fetch("/api/student/support", { credentials: "include" });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to load support thread.");
    }
    setMessages(data.messages ?? []);
  }

  useEffect(() => {
    loadSupport().catch(error => setStatus(error.message));
  }, []);

  async function sendMessage() {
    if (!chatInput.trim()) {
      return;
    }
    const res = await fetch("/api/student/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content: chatInput }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Failed to send support message.");
      return;
    }
    setMessages(data.messages ?? []);
    setChatInput("");
    setStatus("Support request sent.");
  }

  return (
    <SidebarShell>
      <div className="mx-auto flex h-[calc(100vh-140px)] max-w-7xl flex-col gap-6 pb-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
              Support Node - Authorized Channel
            </Badge>
            <h1 className="text-xl font-black text-slate-900">System Support</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Reach the real support thread tied to this student account and keep a persistent issue history.
            </p>
          </div>
        </div>

        {status && <p className="text-sm font-medium text-slate-600">{status}</p>}

        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-4">
            <SpecialistChat
              title="System Concierge"
              specialty="General Protocol Specialist"
              initialMessage="I can help you troubleshoot platform steps and tell you when something should go to human support."
              flow={discussDocuments}
              icon={<ShieldCheck className="h-4 w-4" />}
            />
            <Card className="rounded-[2rem] border-none bg-slate-900 p-6 text-white shadow-xl">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">Secure Channel</p>
              <p className="mt-4 text-sm text-slate-300">
                Messages in this support thread are stored per student account and can be followed up later.
              </p>
            </Card>
          </div>

          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <LifeBuoy className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-black">Admin Direct</CardTitle>
                  <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">Persistent support thread</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex h-[calc(100vh-320px)] flex-col gap-4">
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {messages.length > 0 ? messages.map(message => (
                  <div
                    key={message.id}
                    className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                      message.role === "user"
                        ? "ml-auto bg-primary text-white"
                        : message.role === "system"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    <p className={`text-xs font-black uppercase tracking-wider ${
                      message.role === "user" || message.role === "system" ? "text-white/70" : "text-slate-400"
                    }`}>
                      {message.role}
                    </p>
                    <p className="mt-2">{message.content}</p>
                    <p className={`mt-2 text-xs uppercase tracking-wider ${
                      message.role === "user" || message.role === "system" ? "text-white/70" : "text-slate-400"
                    }`}>
                      {message.time}
                    </p>
                  </div>
                )) : (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-500">
                    No support messages yet for this student account.
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={event => setChatInput(event.target.value)}
                  placeholder="Describe your issue..."
                  className="h-11 rounded-xl bg-slate-50"
                />
                <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={sendMessage}>
                  <Send className="mr-2 h-4 w-4" /> Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarShell>
  );
}
