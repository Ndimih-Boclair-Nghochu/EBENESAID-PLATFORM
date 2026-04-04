
'use server';
/**
 * @fileOverview The Kitchen Specialist AI.
 * Handles student dietary queries, neighborhood delivery navigation, and supplier menu optimization.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KitchenInputSchema = z.object({
  message: z.string().describe('The user\'s question about food, delivery locations, dietary needs, or orders.'),
});

const KitchenOutputSchema = z.object({
  response: z.string().describe('Expert culinary and delivery logistics guidance.'),
});

export async function discussKitchen(input: {message: string}) {
  return kitchenFlow(input);
}

const kitchenFlow = ai.defineFlow(
  {
    name: 'kitchenFlow',
    inputSchema: KitchenInputSchema,
    outputSchema: KitchenOutputSchema,
  },
  async (input) => {
    const {text} = await ai.generate({
      system: `You are the EBENESAID Kitchen Specialist. 
      You bridge the gap between international students and verified food suppliers in Latvia, focusing on delivery to student housing and campus locations.
      
      EXPERT DOMAINS:
      1. Neighborhood Delivery: Explaining delivery availability in Centrs, Āgenskalns, Teika, and other student-dense areas.
      2. Dietary Navigation: Explaining Halal, Vegan, or allergen-free options in Riga.
      3. Cultural Comfort: Recommending West African, Indian, or local Latvian student meals.
      4. Supplier Support: Helping suppliers understand student demand, delivery route optimization, and packaging standards.
      
      Tone: Warm, efficient, and appetizing. Keep responses concise and focused on reliable delivery.`,
      prompt: input.message,
    });
    return {response: text};
  }
);
