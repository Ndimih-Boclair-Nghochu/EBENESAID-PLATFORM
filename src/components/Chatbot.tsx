"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Send, Compass, Loader2, ExternalLink } from "lucide-react";
import { ebenesaidInfo } from "@/ai/flows/ebenesaid-info-flow";
import Link from "next/link";

type Message = {
  role: 'user' | 'assistant';
  content: string;
  links?: { title: string, path: string }[];
};

/**
 * @component Chatbot
 * @description The "Platform Navigator" AI. Global floating chat for navigation help.
 */
export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I am the Platform Navigator. I can help you find your way around EBENESAID and provide direct links to our core modules. What are you looking for?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const result = await ebenesaidInfo({ message: userMessage });
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.response,
        links: result.links
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a connection hiccup. Please try again or head to our help center." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100]">
      {isOpen ? (
        <Card className="w-[calc(100vw-2rem)] sm:w-[400px] md:w-[450px] max-h-[85vh] h-[600px] sm:h-[700px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] border-none overflow-hidden flex flex-col rounded-[2.5rem] sm:rounded-[3.5rem] animate-in slide-in-from-bottom-12 duration-700 bg-white">
          <CardHeader className="bg-slate-900 text-white flex flex-row items-center justify-between p-6 sm:p-8 relative overflow-hidden shrink-0 z-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
            <div className="flex items-center gap-4 relative">
              <div className="bg-primary p-2.5 rounded-2xl shadow-2xl shadow-primary/40">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-black italic tracking-tight uppercase leading-none">Navigator</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">Platform AI Live</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-full h-10 w-10 relative">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          
          <CardContent 
            ref={scrollRef}
            className="flex-1 min-h-0 p-4 sm:p-6 md:p-8 overflow-y-auto bg-slate-50 space-y-6 scroll-smooth z-0"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-lg ${msg.role === 'assistant' ? 'bg-primary' : 'bg-slate-800'}`}>
                  {msg.role === 'assistant' ? 'NAV' : 'ME'}
                </div>
                <div className={`max-w-[85%] space-y-4`}>
                  <div className={`p-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm text-sm sm:text-base font-medium leading-relaxed border ${
                    msg.role === 'assistant' 
                    ? 'bg-white text-slate-700 border-slate-100 rounded-tl-none italic' 
                    : 'bg-slate-800 text-white border-slate-700 rounded-tr-none'
                  }`}>
                    {msg.content}
                    
                    {msg.links && msg.links.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Direct Access</p>
                        {msg.links.map((link, idx) => (
                          <Button key={idx} asChild variant="outline" className="justify-between h-10 rounded-xl font-black text-xs border-primary/20 hover:bg-primary/5 hover:text-primary transition-all group/link">
                            <Link href={link.path}>
                              {link.title}
                              <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                            </Link>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-lg">
                  NAV
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scanning Platform...</span>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-4 sm:p-6 md:p-8 bg-white border-t border-slate-100 shrink-0 z-10">
            <div className="flex w-full gap-2 bg-slate-100 p-2 rounded-full border border-slate-200 focus-within:border-primary transition-all">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Where would you like to go?" 
                className="h-10 sm:h-12 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold px-4 sm:px-6 text-slate-700 text-sm flex-1" 
              />
              <Button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon" 
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-2xl shadow-primary/30 shrink-0 bg-primary hover:scale-105 transition-all"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          size="lg" 
          onClick={() => setIsOpen(true)} 
          className="h-14 w-14 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-2xl sm:rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(14,165,233,0.5)] p-0 hover:scale-105 transition-all duration-500 bg-primary group"
        >
          <Compass className="h-7 w-7 sm:h-10 sm:w-10 md:h-12 md:w-12 group-hover:rotate-6 transition-transform text-white" />
        </Button>
      )}
    </div>
  );
}
