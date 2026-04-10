'use client';

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Send, Sparkles, Users } from "lucide-react";

import { discussCommunity } from "@/ai/flows/social-specialist-flow";
import { SpecialistChat } from "@/components/SpecialistChat";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CommunityCircle = {
  id: number;
  name: string;
  members: string;
  description: string;
  joined: boolean;
  status: "pending" | "approved" | "rejected";
  isMine: boolean;
  rejectionReason: string;
};

type CircleMessage = {
  id: number;
  circleId: number;
  author: string;
  content: string;
  createdAt: string;
};

export default function CommunityPage() {
  const [circles, setCircles] = useState<CommunityCircle[]>([]);
  const [messages, setMessages] = useState<CircleMessage[]>([]);
  const [activeCircleId, setActiveCircleId] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [circleName, setCircleName] = useState("");
  const [circleDescription, setCircleDescription] = useState("");
  const [isSubmittingCircle, setIsSubmittingCircle] = useState(false);

  async function loadCommunity() {
    const res = await fetch("/api/student/community", { credentials: "include" });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to load community data.");
    }
    setCircles(data.circles ?? []);
    setMessages(data.messages ?? []);
    setActiveCircleId((current: number | null) => current ?? data.circles?.[0]?.id ?? null);
  }

  useEffect(() => {
    loadCommunity().catch(error => setStatus(error.message));
  }, []);

  async function joinCircle(circleId: number) {
    const res = await fetch("/api/student/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "join", circleId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Failed to join circle.");
      return;
    }
    setCircles(data.circles ?? []);
    setMessages(data.messages ?? []);
    setStatus("Circle joined successfully.");
  }

  async function sendMessage() {
    if (!activeCircleId || !chatInput.trim()) {
      return;
    }
    const res = await fetch("/api/student/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "message", circleId: activeCircleId, content: chatInput }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Failed to send message.");
      return;
    }
    setCircles(data.circles ?? []);
    setMessages(data.messages ?? []);
    setChatInput("");
    setStatus("Community message sent.");
  }

  async function submitCircleRequest() {
    if (!circleName.trim() || !circleDescription.trim()) {
      setStatus("Community name and description are required.");
      return;
    }

    setIsSubmittingCircle(true);
    const res = await fetch("/api/student/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        action: "request-circle",
        name: circleName,
        description: circleDescription,
      }),
    });
    const data = await res.json();
    setIsSubmittingCircle(false);

    if (!res.ok) {
      setStatus(data.error || "Failed to submit community request.");
      return;
    }

    setCircles(data.circles ?? []);
    setMessages(data.messages ?? []);
    setCircleName("");
    setCircleDescription("");
    setStatus("Community request submitted. An admin must approve it before it is published.");
  }

  const activeCircle = useMemo(
    () => circles.find(circle => circle.id === activeCircleId) ?? null,
    [activeCircleId, circles]
  );
  const activeMessages = useMemo(
    () => messages.filter(message => message.circleId === activeCircleId),
    [activeCircleId, messages]
  );

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
                Social Node - Live Circles
              </Badge>
              <div className="flex items-center gap-1.5 rounded-full bg-purple-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-purple-600">
                <Sparkles className="h-2.5 w-2.5" /> Matching Active
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900">Student Circle</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Join communities, browse real posts, and message people inside active student circles.
            </p>
          </div>
        </div>

        {status && <p className="text-sm font-medium text-slate-600">{status}</p>}

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SpecialistChat
              title="Social Specialist"
              specialty="Community & Cultural Integration Expert"
              initialMessage="I can help you find student groups, understand the social scene, and figure out where to connect next."
              flow={discussCommunity}
              icon={<Users className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="rounded-[1.5rem] border-none bg-slate-900 p-6 text-white shadow-xl">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">Community Pulse</p>
              <p className="mt-4 text-3xl font-black">{circles.length}</p>
              <p className="mt-2 text-sm text-slate-300">Live circles available for this student account.</p>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-base font-black">Available Circles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-4">
                <p className="text-sm font-black text-slate-900">Create A Student Circle</p>
                <p className="mt-1 text-xs text-slate-500">
                  Student-created communities must be approved by an admin before they are published.
                </p>
                <div className="mt-4 space-y-3">
                  <Input
                    value={circleName}
                    onChange={event => setCircleName(event.target.value)}
                    placeholder="Circle name"
                    className="h-11 rounded-xl bg-white"
                  />
                  <Textarea
                    value={circleDescription}
                    onChange={event => setCircleDescription(event.target.value)}
                    placeholder="Describe what this circle is for"
                    className="min-h-[88px] rounded-xl bg-white"
                  />
                  <Button
                    className="w-full rounded-xl bg-green-700 hover:bg-green-800"
                    onClick={submitCircleRequest}
                    disabled={isSubmittingCircle}
                  >
                    {isSubmittingCircle ? "Submitting..." : "Submit For Approval"}
                  </Button>
                </div>
              </div>

              {circles.map(circle => (
                <button
                  key={circle.id}
                  type="button"
                  onClick={() => setActiveCircleId(circle.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    circle.id === activeCircleId ? "border-primary bg-primary/5" : "border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-black text-slate-900">{circle.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{circle.members} members</p>
                    </div>
                    <Badge variant={circle.status === "approved" ? (circle.joined ? "default" : "outline") : "secondary"}>
                      {circle.status === "approved" ? (circle.joined ? "Joined" : "Open") : circle.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{circle.description}</p>
                  {circle.status === "rejected" && circle.isMine && (
                    <p className="mt-3 text-xs font-medium text-red-600">
                      Rejected: {circle.rejectionReason || "No reason was provided by the admin."}
                    </p>
                  )}
                  {circle.status === "pending" && circle.isMine && (
                    <p className="mt-3 text-xs font-medium text-amber-600">
                      Waiting for admin approval before this circle goes live.
                    </p>
                  )}
                  {circle.status === "approved" && !circle.joined && (
                    <Button
                      className="mt-4 rounded-xl bg-green-700 hover:bg-green-800"
                      onClick={event => {
                        event.stopPropagation();
                        joinCircle(circle.id);
                      }}
                    >
                      Join Circle
                    </Button>
                  )}
                </button>
              ))}
              {!circles.length && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                  No real community circles are available yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-8">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base font-black">{activeCircle?.name ?? "Select a Circle"}</CardTitle>
                  <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                  {activeCircle?.description ?? "Pick a community space to read and post updates."}
                  </p>
                </div>
                {activeCircle && <Badge>{activeCircle.members} members</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {activeMessages.length > 0 ? activeMessages.map(message => (
                  <div key={message.id} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-slate-900">{message.author}</p>
                      <p className="text-xs uppercase tracking-wider text-slate-400">{message.createdAt}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{message.content}</p>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                    No messages yet in this circle.
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={event => setChatInput(event.target.value)}
                  placeholder={activeCircle ? `Message ${activeCircle.name}...` : "Select a circle first"}
                  disabled={!activeCircle || !activeCircle.joined || activeCircle.status !== "approved"}
                  className="h-11 rounded-xl bg-slate-50"
                />
                <Button
                  className="rounded-xl bg-green-700 hover:bg-green-800"
                  onClick={sendMessage}
                  disabled={!activeCircle || !activeCircle.joined || activeCircle.status !== "approved"}
                >
                  <Send className="mr-2 h-4 w-4" /> Send
                </Button>
              </div>
              {activeCircle && activeCircle.status !== "approved" && (
                <p className="text-xs text-amber-600">This circle cannot receive messages until an admin approves it.</p>
              )}
              {activeCircle && activeCircle.status === "approved" && !activeCircle.joined && (
                <p className="text-xs text-slate-500">Join this circle first to post messages.</p>
              )}

              <Button variant="outline" className="rounded-xl" asChild>
                <a href="/messages">
                  <MessageSquare className="mr-2 h-4 w-4" /> Open Direct Messages
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarShell>
  );
}
