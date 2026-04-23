'use server';
import { runLocalSpecialist, type AiUserContext } from '../local-brain';


type CareerSpecialistInput = {
  message: string;
  user?: AiUserContext;
};

type CareerSpecialistOutput = {
  response: string;
};


export async function discussCareers(input: CareerSpecialistInput): Promise<CareerSpecialistOutput> {
  const result = await runLocalSpecialist({
    specialist: 'career',
    message: input.message,
    user: input.user,
  });
  return { response: result.response };
}
