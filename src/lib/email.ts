const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const DEFAULT_LOGIN_URL = 'https://ebenesaid.com/login';

type BrevoRecipient = {
  email: string;
  name: string;
};

type BrevoEmailInput = {
  to: BrevoRecipient;
  subject: string;
  htmlContent: string;
  textContent: string;
};

export type EmailSendResult = {
  ok: boolean;
  provider: 'brevo';
  messageId?: string;
  error?: string;
};

export type AccountCreatedEmailInput = {
  toEmail: string;
  firstName: string;
  lastName: string;
  loginEmail: string;
  temporaryPassword: string;
  userType: string;
  partnerType?: string;
  loginUrl?: string;
};

function getBrevoConfig() {
  const apiKey = process.env.BREVO_API_KEY?.trim() || process.env.BREVO_SMTP_API_KEY?.trim() || '';
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim() || process.env.SMTP_FROM_EMAIL?.trim() || '';
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || process.env.SMTP_FROM_NAME?.trim() || 'EBENESAID';

  return {
    apiKey,
    senderEmail,
    senderName,
  };
}

function formatAccountType(userType: string, partnerType?: string) {
  const normalizedPartnerType = String(partnerType ?? userType).trim().toLowerCase();

  switch (userType) {
    case 'staff':
      return 'Staff Account';
    case 'investor':
      return 'Investor Account';
    case 'university':
      return normalizedPartnerType === 'school' ? 'School Partner Account' : 'School Partner Account';
    case 'agent':
      return normalizedPartnerType === 'house agent' ? 'House Agent Partner Account' : 'House Agent Partner Account';
    case 'job_partner':
      return normalizedPartnerType === 'job supplier' ? 'Job Supplier Partner Account' : 'Job Supplier Partner Account';
    case 'supplier':
      return normalizedPartnerType === 'cook' || normalizedPartnerType === 'food supplier'
        ? 'Cook / Food Supplier Partner Account'
        : 'Cook / Food Supplier Partner Account';
    case 'transport':
      return normalizedPartnerType === 'transport agent' ? 'Transport Agent Partner Account' : 'Transport Agent Partner Account';
    default:
      return 'Platform Account';
  }
}

function buildAccountCreatedEmail(input: AccountCreatedEmailInput) {
  const fullName = `${input.firstName} ${input.lastName}`.trim();
  const loginUrl = input.loginUrl?.trim() || DEFAULT_LOGIN_URL;
  const accountType = formatAccountType(input.userType, input.partnerType);
  const greetingName = input.firstName.trim() || fullName || 'there';

  const subject = `Your EBENESAID ${accountType} is ready`;

  const htmlContent = `
    <div style="background:#f8fafc;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#166534;padding:28px 32px;">
          <div style="font-size:12px;letter-spacing:0.24em;text-transform:uppercase;font-weight:700;color:#bbf7d0;">EBENESAID</div>
          <h1 style="margin:12px 0 0;font-size:28px;line-height:1.15;color:#ffffff;">Your account is ready</h1>
        </div>
        <div style="padding:32px;">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hello ${escapeHtml(greetingName)},</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">
            An administrator has created your <strong>${escapeHtml(accountType)}</strong> on EBENESAID.
            You can now sign in using the credentials below.
          </p>
          <div style="margin:24px 0;border:1px solid #dcfce7;background:#f0fdf4;border-radius:18px;padding:20px 22px;">
            <div style="margin-bottom:10px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#15803d;">Login details</div>
            <p style="margin:8px 0;font-size:14px;line-height:1.6;"><strong>Account type:</strong> ${escapeHtml(accountType)}</p>
            <p style="margin:8px 0;font-size:14px;line-height:1.6;"><strong>Login email:</strong> ${escapeHtml(input.loginEmail)}</p>
            <p style="margin:8px 0;font-size:14px;line-height:1.6;"><strong>Temporary password:</strong> ${escapeHtml(input.temporaryPassword)}</p>
            <p style="margin:8px 0;font-size:14px;line-height:1.6;"><strong>Login link:</strong> <a href="${loginUrl}" style="color:#166534;text-decoration:none;">${loginUrl}</a></p>
          </div>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#475569;">
            This password is temporary. Please sign in and change your password as soon as possible after your first login.
          </p>
          <div style="margin-top:28px;">
            <a href="${loginUrl}" style="display:inline-block;background:#166534;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:14px;font-size:14px;font-weight:700;">Go to EBENESAID Login</a>
          </div>
          <p style="margin:28px 0 0;font-size:13px;line-height:1.7;color:#64748b;">
            If you were not expecting this account, please contact the EBENESAID administrator before signing in.
          </p>
        </div>
      </div>
    </div>
  `;

  const textContent = [
    `Hello ${greetingName},`,
    '',
    `An administrator has created your ${accountType} on EBENESAID.`,
    'You can now sign in using the credentials below:',
    '',
    `Account type: ${accountType}`,
    `Login email: ${input.loginEmail}`,
    `Temporary password: ${input.temporaryPassword}`,
    `Login link: ${loginUrl}`,
    '',
    'This password is temporary. Please change it after your first login.',
    '',
    'If you were not expecting this account, please contact the EBENESAID administrator.',
  ].join('\n');

  return { subject, htmlContent, textContent };
}

async function sendBrevoEmail(input: BrevoEmailInput): Promise<EmailSendResult> {
  const { apiKey, senderEmail, senderName } = getBrevoConfig();

  if (!apiKey || !senderEmail) {
    return {
      ok: false,
      provider: 'brevo',
      error: 'Brevo email configuration is missing.',
    };
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: {
          email: senderEmail,
          name: senderName,
        },
        to: [input.to],
        subject: input.subject,
        htmlContent: input.htmlContent,
        textContent: input.textContent,
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        provider: 'brevo',
        error: `Brevo request failed with status ${response.status}.`,
      };
    }

    const payload = (await response.json()) as { messageId?: string };
    return {
      ok: true,
      provider: 'brevo',
      messageId: payload.messageId,
    };
  } catch (error) {
    return {
      ok: false,
      provider: 'brevo',
      error: error instanceof Error ? error.message : 'Unknown Brevo email error.',
    };
  }
}

export async function sendAccountCreatedEmail(input: AccountCreatedEmailInput): Promise<EmailSendResult> {
  const email = buildAccountCreatedEmail(input);

  return sendBrevoEmail({
    to: {
      email: input.toEmail,
      name: `${input.firstName} ${input.lastName}`.trim() || input.toEmail,
    },
    subject: email.subject,
    htmlContent: email.htmlContent,
    textContent: email.textContent,
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
