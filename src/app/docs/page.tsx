'use client';

import { useEffect, useMemo, useState } from "react";
import { Download, FileText, Lock, Upload } from "lucide-react";

import { discussDocuments } from "@/ai/flows/document-specialist-flow";
import { SpecialistChat } from "@/components/SpecialistChat";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type StudentDocument = {
  id: number;
  name: string;
  status: string;
  dateLabel: string;
  type: string;
  fileUrl: string;
};

export default function DocumentWalletPage() {
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function loadDocuments() {
    const res = await fetch("/api/student/documents", { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load documents.");
    setDocuments(data.documents ?? []);
  }

  useEffect(() => {
    loadDocuments().catch(err => setMessage(err.message));
  }, []);

  async function handleUpload() {
    const res = await fetch("/api/student/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, type, fileUrl }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Failed to save document.");
      return;
    }
    setDocuments(data.documents ?? []);
    setName("");
    setType("");
    setFileUrl("");
    setMessage("Document saved successfully.");
  }

  const verifiedCount = useMemo(
    () => documents.filter(doc => doc.status === "Verified").length,
    [documents]
  );
  const auditScore = documents.length ? Math.round((verifiedCount / documents.length) * 100) : 0;

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
              Security Node - Encryption Active
            </Badge>
            <h1 className="text-xl font-black text-slate-900">Document Wallet</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Real student document storage with saved upload metadata.
            </p>
          </div>
        </div>

        {message && <p className="text-sm font-medium text-slate-600">{message}</p>}

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SpecialistChat
              title="Compliance Specialist"
              specialty="Security & Visa Protocol Expert"
              initialMessage="I can help you understand compliance requirements, visa paperwork, and document verification."
              flow={discussDocuments}
              icon={<Lock className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="rounded-[1.5rem] border-none bg-slate-900 p-6 text-white shadow-xl">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">Compliance Health</p>
              <p className="mt-4 text-3xl font-black">{auditScore}%</p>
              <p className="mt-2 text-sm text-slate-300">{verifiedCount} verified documents</p>
            </Card>
          </div>
        </div>

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black">Upload Document</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Input value={type} onChange={e => setType(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>File URL</Label>
              <Input value={fileUrl} onChange={e => setFileUrl(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button className="w-full rounded-xl bg-green-700 hover:bg-green-800" onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" /> Save
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black">Compliance Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900">{doc.name}</p>
                  <p className="text-xs uppercase tracking-wider text-slate-400">{doc.type} | {doc.dateLabel}</p>
                </div>
                <Badge>{doc.status}</Badge>
                {doc.fileUrl ? (
                  <Button variant="outline" className="rounded-xl" asChild>
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                      <Download className="mr-2 h-4 w-4" /> Open
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="rounded-xl">No File</Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </SidebarShell>
  );
}
