"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, MessagesSquare, ShieldCheck, Sparkles } from "lucide-react";

import { useAuthContext } from "@/auth/provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Listing = {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  status: string;
  details: string;
  imageUrl: string;
  leads: number;
  trustScore: number;
};

type ListingSummary = {
  summary: string;
  pros: string[];
  matchScore: number;
};

function getRecommendationReason(listing: Listing, summary: ListingSummary, userName?: string, university?: string) {
  if (summary.matchScore < 8) {
    return null;
  }

  const commuteReason = university
    ? `it supports a cleaner commute rhythm for ${university}`
    : "it balances location and reliability well";

  const trustReason = listing.status === "Verified"
    ? "it is already inside the verified EBENESAID housing workflow"
    : "it is close to matching the verified workflow";

  return `EBENESAID AI recommends this${userName ? ` for ${userName}` : ""} because ${trustReason} and ${commuteReason}.`;
}

export function AccommodationListings() {
  const { user } = useAuthContext();
  const [listings, setListings] = useState<Listing[]>([]);
  const [summaries, setSummaries] = useState<Record<number, ListingSummary>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      try {
        setLoading(true);
        const res = await fetch("/api/listings", { credentials: "include" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load listings.");
        }

        if (isMounted) {
          setListings(data.listings ?? []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load listings.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadListings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!listings.length) return;

    const userPreferences = {
      universityProximity: user?.university || "close",
      preferredNationalities: user?.countryOfOrigin ? [user.countryOfOrigin, "Any"] : ["Any"],
      budget: "EUR 250-EUR 500",
    };

    listings.forEach(listing => {
      if (summaries[listing.id]) return;

      fetch("/api/accommodation-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accommodationListing: listing.details,
          userPreferences,
        }),
      })
        .then(res => res.json())
        .then(data => {
          setSummaries(prev => ({
            ...prev,
            [listing.id]: {
              summary: data.summary || "No summary available.",
              pros: data.pros || [],
              matchScore: typeof data.matchScore === "number" ? data.matchScore : 0,
            },
          }));
        })
        .catch(() => {
          setSummaries(prev => ({
            ...prev,
            [listing.id]: {
              summary: "AI summary is unavailable right now.",
              pros: [],
              matchScore: 0,
            },
          }));
        });
    });
  }, [listings, summaries, user]);

  if (loading) {
    return <p className="text-sm font-medium text-slate-500">Loading verified accommodation...</p>;
  }

  if (error) {
    return <p className="text-sm font-medium text-red-600">{error}</p>;
  }

  if (!listings.length) {
    return <p className="text-sm font-medium text-slate-500">No verified listings are available yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {listings.map(listing => {
        const aiSummary = summaries[listing.id] || {
          summary: "Preparing AI insights...",
          pros: [],
          matchScore: 0,
        };
        const recommendationReason = getRecommendationReason(
          listing,
          aiSummary,
          user?.firstName,
          user?.university
        );

        return (
          <Card
            key={listing.id}
            className="group flex flex-col overflow-hidden rounded-[2rem] border-none bg-white shadow-sm transition-all duration-300 hover:shadow-lg sm:flex-row"
          >
            <div className="relative aspect-video w-full shrink-0 overflow-hidden sm:w-48 sm:aspect-auto">
              <Image
                src={listing.imageUrl}
                alt={listing.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute left-2.5 top-2.5">
                <Badge className="flex items-center gap-1 rounded-lg border-none bg-white/95 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider text-primary shadow-sm backdrop-blur">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  {listing.status}
                </Badge>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-0.5">
                    <CardTitle className="truncate text-sm font-black leading-none tracking-tight text-slate-900 transition-colors group-hover:text-primary">
                      {listing.title}
                    </CardTitle>
                    <CardDescription className="flex truncate items-center gap-1 text-[8px] font-bold uppercase tracking-tight text-slate-400">
                      <MapPin className="h-2 w-2 text-primary" />
                      {listing.location}
                    </CardDescription>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-base font-black leading-none tracking-tighter text-primary">
                      EUR {listing.price}
                    </p>
                    <p className="mt-0.5 text-[6px] font-black uppercase tracking-widest text-slate-400">
                      / Month
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                  <p className="mb-1.5 flex items-center gap-1 text-[7px] font-black uppercase tracking-[0.2em] text-primary">
                    <Sparkles className="h-2.5 w-2.5 fill-primary/20" />
                    AI Insights - {Math.round(aiSummary.matchScore * 10)}% Match
                  </p>
                  {recommendationReason && (
                    <div className="mb-2 rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-1.5">
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-700">
                        EBENESAID AI Recommends This
                      </p>
                      <p className="mt-1 text-[10px] font-medium leading-relaxed text-emerald-800">
                        {recommendationReason}
                      </p>
                    </div>
                  )}
                  <p className="mb-2 line-clamp-2 text-[10px] font-medium italic leading-relaxed text-slate-600">
                    "{aiSummary.summary}"
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {aiSummary.pros.slice(0, 2).map((pro, index) => (
                      <Badge
                        key={`${listing.id}-${index}`}
                        className="rounded-md border border-slate-100 bg-white px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-tighter text-slate-400"
                      >
                        {pro}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto flex gap-2 p-4 pt-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-lg border border-slate-100 text-slate-400 hover:bg-primary/5 hover:text-primary"
                  asChild
                >
                  <Link href="/messages">
                    <MessagesSquare className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="h-8 flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-primary"
                  asChild
                >
                  <Link href="/dashboard">Details</Link>
                </Button>
                <Button
                  className="h-8 flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md shadow-primary/20"
                  asChild
                >
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
