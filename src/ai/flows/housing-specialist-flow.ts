'use server';
import { runLocalSpecialist, type AiUserContext } from '../local-brain';

type HousingSpecialistInput = {
  message: string;
  user?: AiUserContext;
};

type HousingSpecialistOutput = {
  response: string;
};

export async function discussHousing(input: HousingSpecialistInput): Promise<HousingSpecialistOutput> {
  const result = await runLocalSpecialist({
    specialist: 'housing',
    message: input.message,
    user: input.user,
  });
  return { response: result.response };
}
