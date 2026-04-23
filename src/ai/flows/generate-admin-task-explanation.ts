'use server';
import { buildLocalAdminTaskExplanation } from '../local-brain';


export type GenerateAdminTaskExplanationInput = {
  taskDescription: string;
  studentNationality: string;
  studentUniversity: string;
  studentCurrentLocation: string;
  additionalContext?: string;
};

export type GenerateAdminTaskExplanationOutput = {
  explanation: string;
  estimatedTime?: string;
  requiredDocuments?: string[];
  importantTips?: string[];
};


export async function generateAdminTaskExplanation(
  input: GenerateAdminTaskExplanationInput
): Promise<GenerateAdminTaskExplanationOutput> {
  return buildLocalAdminTaskExplanation(input);
}
