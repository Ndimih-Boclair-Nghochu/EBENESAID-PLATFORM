'use server';
import { runLocalSpecialist, type AiUserContext } from '../local-brain';

type SocialSpecialistInput = {
  message: string;
  user?: AiUserContext;
};

type SocialSpecialistOutput = {
  response: string;
};

export async function discussCommunity(input: SocialSpecialistInput): Promise<SocialSpecialistOutput> {
  const result = await runLocalSpecialist({
    specialist: 'community',
    message: input.message,
    user: input.user,
  });
  return { response: result.response };
}
