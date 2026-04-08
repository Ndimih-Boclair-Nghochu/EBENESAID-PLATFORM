"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Bot, ShieldAlert, Sparkles } from "lucide-react";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface SpecialistChatProps {
  title: string;
  specialty: string;
  initialMessage: string;
  flow: (input: { message: string }) => Promise<{ response: string }>;
  icon?: React.ReactNode;
}

/**
 * @component SpecialistChat
 * @description Repositioned for top-level guidance. Compact, context-aware, and responsive.
 */
export function SpecialistChat({ title, specialty, initialMessage, flow, icon }: SpecialistChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: initialMessage }
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
      const result = await flow({ message: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Expert line busy. Please re-send your inquiry." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="flex flex-col h-[320px] sm:h-[380px] border-none shadow-sm rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-white w-full">
      <CardHeader className="bg-slate-50 border-b border-slate-100 p-4 sm:p-5 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-primary shrink-0">
            {icon || <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          </div>
          <div className="min-w-0">
            <CardTitle className="text-[11px] sm:text-sm font-black text-slate-900 tracking-tight leading-none uppercase truncate">{title}</CardTitle>
            <div className="flex items-center gap-2 mt-1 truncate">
              <span className="text-[8px] sm:text-[9px] font-black text-primary uppercase tracking-widest truncate">{specialty}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent 
        ref={scrollRef}
        className="flex-1 min-h-0 p-4 sm:p-5 overflow-y-auto space-y-4 scroll-smooth bg-slate-50/30 custom-scrollbar"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`h-6 w-6 sm:h-7 sm:w-7 rounded-lg flex items-center justify-center text-[7px] sm:text-[8px] font-black text-white shrink-0 shadow-sm ${msg.role === 'assistant' ? 'bg-primary' : 'bg-slate-700'}`}>
              {msg.role === 'assistant' ? 'AI' : 'ME'}
            </div>
            <div className={`max-w-[85%] p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-medium leading-relaxed shadow-sm border ${
              msg.role === 'assistant' 
              ? 'bg-white text-slate-700 border-slate-100 rounded-tl-none' 
              : 'bg-primary text-white border-transparent rounded-tr-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 sm:gap-3">
            <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-primary flex items-center justify-center text-[7px] sm:text-[8px] font-black text-white shrink-0">
              AI
            </div>
            <div className="bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-2 border border-slate-100 shadow-sm">
              <Loader2 className="h-3 w-3 text-primary animate-spin" />
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Processing...</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 shrink-0">
        <div className="flex w-full gap-2 bg-white p-1 rounded-full border border-slate-200 focus-within:border-primary transition-all">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask the ${title}...`} 
            className="h-8 sm:h-9 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold px-3 sm:px-4 text-slate-700 text-xs flex-1" 
          />
          <Button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon" 
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary hover:scale-105 transition-all shadow-lg shrink-0"
          >
            <Send className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-white" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
