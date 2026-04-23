'use server';
import { runLocalSpecialist, type AiUserContext } from '../local-brain';


type DocumentSpecialistInput = {
  message: string;
  user?: AiUserContext;
};

type DocumentSpecialistOutput = {
  response: string;
};


export async function discussDocuments(input: DocumentSpecialistInput): Promise<DocumentSpecialistOutput> {
  const result = await runLocalSpecialist({
    specialist: 'documents',
    message: input.message,
    user: input.user,
  });
  return { response: result.response };
}
