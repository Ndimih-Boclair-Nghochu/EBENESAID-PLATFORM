'use client';

import { useEffect, useMemo, useState } from "react";
import { Activity, ChevronLeft, LifeBuoy, Send } from "lucide-react";

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InboxThread = {
  userId: number;
  name: string;
  email: string;
  type: string;
  lastMsg: string;
  time: string;
  unread: number;
};

type SupportMessage = {
  id: number;
  role: "user" | "admin" | "system";
  time: string;
  content: string;
};

export default function AdminSupportInboxPage() {
  const [threads, setThreads] = useState<InboxThread[]>([]);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function loadInbox(userId?: number) {
    const search = userId ? `?userId=${userId}` : "";
    const res = await fetch(`/api/admin/support${search}`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to load support inbox.");
    }
    setThreads(data.inbox ?? []);
    setMessages(data.messages ?? []);
    setActiveUserId(data.activeUserId ?? null);
  }

  useEffect(() => {
    loadInbox().catch(error => setStatus(error instanceof Error ? error.message : "Failed to load support inbox."));
  }, []);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.userId === activeUserId) ?? null,
    [activeUserId, threads]
  );

  async function sendReply() {
    if (!activeUserId || !chatInput.trim()) {
      return;
    }

    const res = await fetch("/api/admin/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId: activeUserId, content: chatInput }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Failed to send support reply.");
      return;
    }
    setThreads(data.inbox ?? []);
    setMessages(data.messages ?? []);
    setChatInput("");
    setStatus("Support reply sent.");
  }

  return (
    <SidebarShell>
      <div className="mx-auto flex h-[calc(100vh-140px)] max-w-7xl flex-col gap-6 pb-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
                Admin Support Node - Live Inbox
              </Badge>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-emerald-600">
                <Activity className="h-2.5 w-2.5" /> Real Threads
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900">Support Inbox</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Review every student support request, reply directly, and keep a persistent admin response history.
            </p>
          </div>
        </div>

        {status && <p className="text-sm font-medium text-slate-600">{status}</p>}

        <div className="relative grid min-h-0 flex-1 gap-6 lg:grid-cols-12">
          <div className={cn("absolute inset-0 z-20 flex flex-col lg:relative lg:col-span-4", activeUserId ? "hidden lg:flex" : "flex")}>
            <Card className="flex h-full flex-col overflow-hidden rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardHeader className="border-b border-slate-50 p-5">
                <CardTitle className="text-base font-black">Incoming Threads</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                <div className="divide-y divide-slate-50">
                  {threads.length > 0 ? threads.map((thread) => (
                    <button
                      key={thread.userId}
                      type="button"
                      onClick={() => loadInbox(thread.userId).catch(error => setStatus(error instanceof Error ? error.message : "Failed to load thread."))}
                      className="w-full p-4 text-left transition hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-900">{thread.name}</p>
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{thread.type} • {thread.email}</p>
                        </div>
                        {thread.unread > 0 && <Badge>{thread.unread}</Badge>}
                      </div>
                      <p className="mt-2 truncate text-xs text-slate-500">{thread.lastMsg || "No messages yet"}</p>
                      <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-300">{thread.time}</p>
                    </button>
                  )) : (
                    <div className="p-8 text-center text-sm text-slate-500">No support threads yet.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className={cn("absolute inset-0 z-30 flex flex-col lg:relative lg:col-span-8", !activeUserId ? "hidden lg:flex" : "flex")}>
            {activeThread ? (
              <Card className="flex h-full flex-col overflow-hidden rounded-[2rem] border-slate-100 bg-white shadow-sm">
                <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b border-slate-50 p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setActiveUserId(null)} className="h-8 w-8 rounded-lg lg:hidden">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <CardTitle className="text-base font-black">{activeThread.name}</CardTitle>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{activeThread.type} • {activeThread.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline">Active Thread</Badge>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                    {messages.length > 0 ? messages.map((message) => (
                      <div
                        key={message.id}
                        className={`max-w-[85%] rounded-2xl p-4 text-sm ${message.role === "admin" ? "ml-auto bg-primary text-white" : message.role === "system" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700"}`}
                      >
                        <p className={`text-xs font-black uppercase tracking-wider ${message.role === "admin" || message.role === "system" ? "text-white/70" : "text-slate-400"}`}>
                          {message.role}
                        </p>
                        <p className="mt-2">{message.content}</p>
                        <p className={`mt-2 text-xs uppercase tracking-wider ${message.role === "admin" || message.role === "system" ? "text-white/70" : "text-slate-400"}`}>
                          {message.time}
                        </p>
                      </div>
                    )) : (
                      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-500">
                        No support messages in this thread yet.
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Input value={chatInput} onChange={event => setChatInput(event.target.value)} placeholder={`Reply to ${activeThread.name}...`} className="h-11 rounded-xl bg-slate-50" />
                    <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={sendReply}>
                      <Send className="mr-2 h-4 w-4" /> Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex h-full items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white p-12 text-center">
                <div className="space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                    <LifeBuoy className="h-8 w-8" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">Support Command</h3>
                  <p className="text-sm text-slate-500">Select a thread to begin replying from the admin account.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}
