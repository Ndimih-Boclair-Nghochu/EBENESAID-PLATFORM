import { NextResponse } from 'next/server';
import { generateAccommodationSummary } from '@/ai/flows/generate-accommodation-summary';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { accommodationListing, userPreferences } = body;
    if (!accommodationListing || !userPreferences) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    const summary = await generateAccommodationSummary({ accommodationListing, userPreferences });
    return NextResponse.json(summary);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}
