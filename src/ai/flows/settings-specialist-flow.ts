'use server';
import { runLocalSpecialist, type AiUserContext } from '../local-brain';

type SettingsSpecialistInput = {
  message: string;
  user?: AiUserContext;
};

type SettingsSpecialistOutput = {
  response: string;
};

export async function discussSettings(input: SettingsSpecialistInput): Promise<SettingsSpecialistOutput> {
  const result = await runLocalSpecialist({
    specialist: 'settings',
    message: input.message,
    user: input.user,
  });
  return { response: result.response };
}
