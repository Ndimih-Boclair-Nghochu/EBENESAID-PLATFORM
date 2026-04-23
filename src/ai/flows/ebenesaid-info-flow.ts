'use server';
import { runLocalSpecialist, type AiUserContext } from '../local-brain';


type EbenesaidInfoInput = {
  message: string;
  user?: AiUserContext;
};

type EbenesaidInfoOutput = {
  response: string;
  links?: { title: string; path: string }[];
};


export async function ebenesaidInfo(input: EbenesaidInfoInput): Promise<EbenesaidInfoOutput> {
  const result = await runLocalSpecialist({
    specialist: 'navigator',
    message: input.message,
    user: input.user,
  });
  return {
    response: result.response,
    links: result.links,
  };
}
