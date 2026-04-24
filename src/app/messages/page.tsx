'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bot, Briefcase, Building2, ChevronLeft, FileText, Hotel, MessageSquare, Send, Soup, User } from "lucide-react";

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Conversation = {
  id: number;
  name: string;
  type: string;
  lastMsg: string;
  time: string;
  unread: number;
  icon: string;
};

type ConversationMessage = {
  id: number;
  conversationId: number;
  role: "me" | "other" | "admin" | "system";
  name: string;
  content: string;
  time: string;
};

const iconMap = {
  user: User,
  hotel: Hotel,
  soup: Soup,
  building: Building2,
  bot: Bot,
  briefcase: Briefcase,
  file: FileText,
} as const;

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function loadMessages() {
    const res = await fetch("/api/student/messages", { credentials: "include" });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to load conversations.");
    }
    setConversations(data.conversations ?? []);
    setMessages(data.messages ?? []);
    setActiveConversationId((current: number | null) => current ?? data.conversations?.[0]?.id ?? null);
  }

  useEffect(() => {
    loadMessages().catch(error => setStatus(error.message));
  }, []);

  async function sendMessage() {
    if (!activeConversationId || !chatInput.trim()) {
      return;
    }
    const res = await fetch("/api/student/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ conversationId: activeConversationId, content: chatInput }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Failed to send message.");
      return;
    }
    setConversations(data.conversations ?? []);
    setMessages(data.messages ?? []);
    setChatInput("");
    setStatus("Message sent.");
  }

  const activeConversation = useMemo(
    () => conversations.find(conversation => conversation.id === activeConversationId) ?? null,
    [activeConversationId, conversations]
  );
  const activeMessages = useMemo(
    () => messages.filter(message => message.conversationId === activeConversationId),
    [activeConversationId, messages]
  );

  return (
    <SidebarShell>
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl flex-col gap-6 pb-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
              Messaging Node - Real Inbox
            </Badge>
            <h1 className="text-xl font-black text-slate-900">Global Inbox</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Talk to verified agents, suppliers, university contacts, and your own student network.
            </p>
          </div>
        </div>

        {status && <p className="text-sm font-medium text-slate-600">{status}</p>}

        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-12">
          <Card className={`rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-4 ${activeConversation ? "hidden lg:block" : ""}`}>
            <CardHeader>
              <CardTitle className="text-base font-black">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[60vh] space-y-3 overflow-y-auto lg:max-h-[calc(100vh-280px)]">
              {conversations.map(conversation => {
                const Icon = iconMap[conversation.icon as keyof typeof iconMap] ?? User;
                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setActiveConversationId(conversation.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      conversation.id === activeConversationId ? "border-primary bg-primary/5" : "border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-slate-100 p-2 text-slate-500">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate font-black text-slate-900">{conversation.name}</p>
                          <p className="text-xs uppercase tracking-wider text-slate-400">{conversation.time}</p>
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{conversation.type}</p>
                        <p className="mt-2 truncate text-sm text-slate-600">{conversation.lastMsg}</p>
                      </div>
                      {conversation.unread > 0 && <Badge>{conversation.unread}</Badge>}
                    </div>
                  </button>
                );
              })}
              {!conversations.length && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                  No real conversations yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={`rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-8 ${activeConversation ? "" : "hidden lg:block"}`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="rounded-xl lg:hidden" onClick={() => setActiveConversationId(null)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-0">
                  <CardTitle className="text-base font-black">{activeConversation?.name ?? "Select a conversation"}</CardTitle>
                  <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                    {activeConversation?.type ?? "Choose a real conversation from the inbox."}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex min-h-[60vh] flex-col gap-4 lg:h-[calc(100vh-320px)] lg:min-h-0">
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {activeMessages.length > 0 ? activeMessages.map(message => (
                  <div
                    key={message.id}
                    className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                      message.role === "me" ? "ml-auto bg-primary text-white" : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    <p className={`text-xs font-black uppercase tracking-wider ${message.role === "me" ? "text-primary-foreground/70" : "text-slate-400"}`}>
                      {message.name}
                    </p>
                    <p className="mt-2">{message.content}</p>
                    <p className={`mt-2 text-xs uppercase tracking-wider ${message.role === "me" ? "text-primary-foreground/70" : "text-slate-400"}`}>
                      {message.time}
                    </p>
                  </div>
                )) : (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-500">
                    Select a conversation to view messages.
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={chatInput}
                  onChange={event => setChatInput(event.target.value)}
                  placeholder={activeConversation ? `Message ${activeConversation.name}...` : "Select a conversation first"}
                  disabled={!activeConversation}
                  className="h-11 rounded-xl bg-slate-50"
                />
                <Button className="rounded-xl bg-green-700 hover:bg-green-800 sm:min-w-[120px]" onClick={sendMessage} disabled={!activeConversation}>
                  <Send className="mr-2 h-4 w-4" /> Send
                </Button>
              </div>

              <Button variant="outline" className="rounded-xl" asChild>
                <Link href="/support">
                  <MessageSquare className="mr-2 h-4 w-4" /> Contact Support
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarShell>
  );
}
