'use client';

import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShieldCheck } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

/**
 * @component SidebarShell
 * @description The structural frame for the authenticated OS experience. 
 * Optimized for high-density and hydration stability across all devices.
 */
export function SidebarShell({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch for mobile Sheet/ID generation
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50/50 overflow-x-hidden">
      {/* Desktop Sidebar - Professional Sky Blue Slim Profile */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sky-700/30 bg-sky-600 lg:block shadow-[10px_0_40px_rgba(0,0,0,0.1)]">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <MainNav />
          </div>
          <div className="border-t border-white/10 p-4">
            <UserNav />
          </div>
        </div>
      </aside>

      {/* Mobile Header - Compact Brand Alignment */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-4 lg:hidden shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="bg-sky-600 p-1.5 rounded-lg shadow-lg shadow-sky-600/20">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-black tracking-tighter text-slate-900 font-headline italic uppercase leading-none">EBENESAID</span>
        </div>
        
        {mounted && (
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-slate-100 transition-colors">
                <Menu className="h-5 w-5 text-slate-900" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-none bg-sky-600">
              <SheetHeader className="p-6 border-b border-white/10 text-left shrink-0">
                <SheetTitle className="text-white flex items-center gap-2 font-black italic tracking-tighter uppercase">
                  <ShieldCheck className="h-5 w-5 text-white" />
                  EBENESAID
                </SheetTitle>
              </SheetHeader>
              <div className="flex h-[calc(100%-80px)] flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <MainNav />
                </div>
                <div className="border-t border-white/10 p-6">
                  <UserNav />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </header>

      {/* Main Content Area - Optimized Grid Usage */}
      <main className="flex-1 lg:pl-64 pt-14 lg:pt-0 min-w-0 w-full">
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 xl:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
