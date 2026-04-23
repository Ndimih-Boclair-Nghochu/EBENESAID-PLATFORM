'use server';
import { runLocalSpecialist, type AiUserContext } from '../local-brain';

type TransitSpecialistInput = {
  message: string;
  user?: AiUserContext;
};

type TransitSpecialistOutput = {
  response: string;
};

export async function discussTransit(input: TransitSpecialistInput): Promise<TransitSpecialistOutput> {
  const result = await runLocalSpecialist({
    specialist: 'transit',
    message: input.message,
    user: input.user,
  });
  return { response: result.response };
}
