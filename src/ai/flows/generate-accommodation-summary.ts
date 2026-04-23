'use server';
import { buildLocalAccommodationSummary } from '../local-brain';


export type GenerateAccommodationSummaryInput = {
  accommodationListing: string;
  userPreferences: {
    universityProximity?: string;
    preferredNationalities?: string[];
    budget?: string;
  };
};

export type GenerateAccommodationSummaryOutput = {
  summary: string;
  pros: string[];
  cons: string[];
  matchScore: number;
};


export async function generateAccommodationSummary(
  input: GenerateAccommodationSummaryInput
): Promise<GenerateAccommodationSummaryOutput> {
  return buildLocalAccommodationSummary(input);
}
