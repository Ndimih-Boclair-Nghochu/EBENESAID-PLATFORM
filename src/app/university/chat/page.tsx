'use client';

import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';

import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type ChatThread = {
  userId: number;
  name: string;
  email: string;
  country: string;
  lastMsg: string;
};

type ChatMessage = {
  id: number;
  role: string;
  content: string;
  createdAt: string;
};

export default function UniversityMessagingPage() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeStudentId, setActiveStudentId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function loadChat(userId?: number) {
    const query = userId ? `?userId=${userId}` : '';
    const res = await fetch(`/api/university/chat${query}`, { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load university chat.');
    }
    setThreads(data.threads ?? []);
    setActiveStudentId(data.activeStudentId ?? null);
    setMessages(data.messages ?? []);
  }

  useEffect(() => {
    loadChat().catch(error => setStatus(error instanceof Error ? error.message : 'Failed to load university chat.'));
  }, []);

  async function sendMessage() {
    if (!activeStudentId || !input.trim()) return;
    try {
      const res = await fetch('/api/university/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: activeStudentId, content: input }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }
      setThreads(data.threads ?? []);
      setMessages(data.messages ?? []);
      setInput('');
      setStatus('Message sent successfully.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to send message.');
    }
  }

  return (
    <SidebarShell>
      <div className="mx-auto grid max-w-7xl gap-6 pb-10 lg:grid-cols-12">
        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base font-black">Student Threads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {threads.length ? (
              threads.map(thread => (
                <button
                  key={thread.userId}
                  type="button"
                  onClick={() => loadChat(thread.userId).catch(error => setStatus(error instanceof Error ? error.message : 'Failed to load university chat.'))}
                  className={`w-full rounded-2xl border p-4 text-left transition ${activeStudentId === thread.userId ? 'border-indigo-300 bg-indigo-50' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                  <p className="font-black text-slate-900">{thread.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                    {thread.country || 'No country'} | {thread.email}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{thread.lastMsg || 'No messages yet.'}</p>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                No real student support threads exist for this university yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-8">
          <CardHeader>
            <CardTitle className="text-base font-black">Conversation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status ? <p className="text-sm text-slate-600">{status}</p> : null}
            <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-2xl bg-slate-50 p-4">
              {messages.length ? (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`max-w-[80%] rounded-2xl p-3 text-sm ${message.role === 'admin' ? 'ml-auto bg-indigo-600 text-white' : 'bg-white text-slate-700'}`}
                  >
                    <p>{message.content}</p>
                    <p className={`mt-2 text-[10px] ${message.role === 'admin' ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                  No real chat messages exist for the selected student yet.
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={activeStudentId ? 'Send a message to this student...' : 'Select a student thread first'}
                disabled={!activeStudentId}
              />
              <Button onClick={sendMessage} disabled={!activeStudentId || !input.trim()} className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarShell>
  );
}
