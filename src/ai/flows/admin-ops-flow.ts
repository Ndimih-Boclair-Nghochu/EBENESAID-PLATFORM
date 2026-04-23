'use server';
import { runLocalSpecialist, type AiUserContext } from '../local-brain';


type AdminOpsInput = {
  message: string;
  user?: AiUserContext;
};

type AdminOpsOutput = {
  response: string;
};


export async function discussOps(input: AdminOpsInput): Promise<AdminOpsOutput> {
  const result = await runLocalSpecialist({
    specialist: 'ops',
    message: input.message,
    user: input.user,
  });
  return { response: result.response };
}
