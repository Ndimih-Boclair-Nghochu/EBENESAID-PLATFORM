"use client";
import { useEffect, useState } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ShieldCheck, Sparkles, MessagesSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const listings = [
  {
    id: "apt-1",
    title: "Premium Riga Center Studio",
    location: "K. Valdemāra iela, Riga",
    price: 380,
    type: "Studio",
    imgId: "apt-verified-1",
    details: "Luxury student studio in a historic building. Fully furnished, 24sqm. 5 mins walk from University of Latvia. Utilities average €80/mo. Verified high-trust landlord."
  },
  {
    id: "apt-2",
    title: "International Student Hub",
    location: "Zunda krastmala, Riga",
    price: 270,
    type: "Shared Room",
    imgId: "apt-verified-2",
    details: "Modern shared apartment near RTU. Large private bedroom. Sharing with 2 other masters students. All bills included. Excellent community vibes."
  }
];

const userPreferences = {
  universityProximity: "close",
  preferredNationalities: ["Nigerian", "Any"],
  budget: "€250-€400"
};

export function AccommodationListings() {
  const [summaries, setSummaries] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    listings.forEach(listing => {
      setLoading(l => ({ ...l, [listing.id]: true }));
      fetch("/api/accommodation-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accommodationListing: listing.details, userPreferences })
      })
        .then(res => res.json())
        .then(data => {
          setSummaries(s => ({ ...s, [listing.id]: data }));
        })
        .catch(() => {
          setSummaries(s => ({ ...s, [listing.id]: { summary: "AI unavailable.", pros: [], matchScore: 0 } }));
        })
        .finally(() => setLoading(l => ({ ...l, [listing.id]: false })));
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {listings.map(listing => {
        const img = PlaceHolderImages.find(i => i.id === listing.imgId);
        const aiSummary = summaries[listing.id] || { summary: "Loading...", pros: [], matchScore: 0 };
        return (
          <Card key={listing.id} className="overflow-hidden border-none shadow-sm rounded-[2rem] bg-white group flex flex-col sm:flex-row hover:shadow-lg transition-all duration-300">
            <div className="relative w-full sm:w-48 aspect-video sm:aspect-auto shrink-0 overflow-hidden">
              {img && (
                <Image
                  src={img.imageUrl}
                  alt={img.description}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  data-ai-hint={img.imageHint}
                />
              )}
              <div className="absolute top-2.5 left-2.5">
                <Badge className="bg-white/95 backdrop-blur text-primary font-black px-1.5 py-0.5 rounded-lg border-none shadow-sm flex items-center gap-1 text-[7px] uppercase tracking-wider">
                  <ShieldCheck className="h-2.5 w-2.5" /> Verified
                </Badge>
              </div>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <CardTitle className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight leading-none truncate">{listing.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 font-bold text-slate-400 text-[8px] uppercase tracking-tight truncate">
                      <MapPin className="h-2 w-2 text-primary" /> {listing.location}
                    </CardDescription>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-black text-primary tracking-tighter leading-none">€{listing.price}</p>
                    <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest mt-0.5">/ Month</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 relative overflow-hidden">
                  <p className="text-[7px] font-black text-primary uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 fill-primary/20" /> AI Insights • {aiSummary.matchScore * 10}% Match
                  </p>
                  <p className="text-[10px] font-medium text-slate-600 italic leading-relaxed mb-2 line-clamp-2">
                    "{aiSummary.summary}"
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(aiSummary.pros || []).slice(0, 2).map((pro: string, i: number) => (
                      <Badge key={i} className="bg-white text-slate-400 font-bold border-slate-100 rounded-md text-[7px] px-1.5 py-0.5 uppercase tracking-tighter">
                        {pro}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2 mt-auto">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shrink-0 text-slate-400 hover:text-primary hover:bg-primary/5 border border-slate-100" asChild>
                  <Link href="/messages"><MessagesSquare className="h-4 w-4" /></Link>
                </Button>
                <Button variant="ghost" className="h-8 rounded-lg flex-1 font-black text-[9px] text-slate-400 hover:text-primary hover:bg-slate-50 uppercase tracking-widest" asChild>
                  <Link href="/dashboard">Details</Link>
                </Button>
                <Button className="h-8 rounded-lg flex-1 font-black text-[9px] shadow-md shadow-primary/20 uppercase tracking-widest" asChild>
                  <Link href="/dashboard">Request Booking</Link>
                </Button>
              </CardFooter>
            </div>
          </Card>
        );
      })}
    </div>
  );
}