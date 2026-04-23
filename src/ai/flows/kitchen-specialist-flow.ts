'use server';
import { runLocalSpecialist, type AiUserContext } from '../local-brain';

type KitchenSpecialistInput = {
  message: string;
  user?: AiUserContext;
};

type KitchenSpecialistOutput = {
  response: string;
};

export async function discussKitchen(input: KitchenSpecialistInput): Promise<KitchenSpecialistOutput> {
  const result = await runLocalSpecialist({
    specialist: 'kitchen',
    message: input.message,
    user: input.user,
  });
  return { response: result.response };
}
