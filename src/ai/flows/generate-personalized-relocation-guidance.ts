'use server';
import { buildLocalRelocationGuidance } from '../local-brain';


export type GeneratePersonalizedRelocationGuidanceInput = {
  university: string;
  nationality: string;
  arrivalStatus: string;
};

export type GeneratePersonalizedRelocationGuidanceOutput = {
  checklist: { task: string; isCompleted: boolean }[];
  guidance: string;
};


export async function generatePersonalizedRelocationGuidance(
  input: GeneratePersonalizedRelocationGuidanceInput
): Promise<GeneratePersonalizedRelocationGuidanceOutput> {
  return buildLocalRelocationGuidance(input);
}
